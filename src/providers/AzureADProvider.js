import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Ajax } from '../services/ajax';

const AzureADContext = createContext();

export const useAzureAD = () => useContext(AzureADContext);

export const AzureADProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const pollingRef = useRef(null);

    const runPowerShellCommand = async (command) => {
        setLoading(true);
        try {
            const response = await Ajax.postRequest('/api/powershell/run', { command: command });
            setOutput(response?.data || "Aucune réponse");
            console.log(response?.data);
            return response.data;
        } catch (error) {
            console.error("❌ Erreur lors de l'exécution PowerShell :", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // 1. Obtenir les licences disponibles (SKU)
    const getAvailableSKUs = async () => {
        const command = `Get-AzureADSubscribedSku | Select SkuPartNumber, SkuId | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 src/main/resources/scripts/powershell/azure_licences.json`;
        try {
            const response = await Ajax.postRequest('/api/powershell/get-licences', { command: command });
            setOutput(response?.data || "Aucune réponse");
            return response.data;
        } catch (error) {
            console.error("❌ Erreur lors de l'exécution PowerShell :", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getADUsers = async () => {
        const command = `Get-AzureADUser | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 src/main/resources/scripts/powershell/azure_users.json`;
        try {
            const response = await Ajax.postRequest('/api/powershell/get-users', { command: command });
            setOutput(response?.data || "Aucune réponse");
            return response.data;
        } catch (error) {
            console.error("❌ Erreur lors de l'exécution PowerShell :", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // 2. Vérifier si l'utilisateur existe
    const checkUserExists = async (userPrincipalName) => {
        const command = `Get-AzureADUser -Filter "UserPrincipalName eq '${userPrincipalName}'" | Select ObjectId, UserPrincipalName | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 src/main/resources/scripts/powershell/ExistUser.json`;
        try {
            const response = await Ajax.postRequest('/api/powershell/check-user', { command: command });
            setOutput(response?.data || "Aucune réponse");
            return response.data;
        } catch (error) {
            console.error("❌ Erreur lors de l'exécution PowerShell :", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // 3. Créer un utilisateur s’il n’existe pas
    const createAzureUser = async ({ displayName, userPrincipalName, password }) => {
        const command = `
            New-AzureADUser -DisplayName "${displayName}" `
            + `-UserPrincipalName "${userPrincipalName}" `
            + `-AccountEnabled $true `
            + `-MailNickname "${userPrincipalName.split('@')[0]}" `
            + `-PasswordProfile @{ForceChangePasswordNextLogin=$false; Password="${password}"} | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 src/main/resources/scripts/powershell/response.json
        `;
        return await runPowerShellCommand(command);
    };

    // 4. Récupérer l’ObjectId d’un utilisateur
    const getUserObjectId = async (userPrincipalName) => {
        const command = `Get-AzureADUser -Filter "UserPrincipalName eq '${userPrincipalName}'" | Select ObjectId | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 src/main/resources/scripts/powershell/response.json`;
        return await runPowerShellCommand(command);
    };

    // 5. Attribuer une licence
    const assignLicenseToUser = async (userPrincipalName, skuId) => {
        const command = `
        $user = Get-AzureADUser -Filter "UserPrincipalName eq '${userPrincipalName}'"

        # Vérifie si UsageLocation est vide
        if (-not $user.UsageLocation) {
            # Définit une valeur par défaut (ici "CD" pour RDC)
            Set-AzureADUser -ObjectId $user.ObjectId -UsageLocation "CD"
            
            # Recharge l'utilisateur avec la nouvelle valeur
            $user = Get-AzureADUser -ObjectId $user.ObjectId
        }

        # Prépare la licence
        $license = New-Object -TypeName Microsoft.Open.AzureAD.Model.AssignedLicense
        $license.SkuId = "${skuId}"

        $licenseAssignment = New-Object -TypeName Microsoft.Open.AzureAD.Model.AssignedLicenses
        $licenseAssignment.AddLicenses = @($license)
        $licenseAssignment.RemoveLicenses = @()

        # Assigne la licence
        Set-AzureADUserLicense -ObjectId $user.ObjectId -AssignedLicenses $licenseAssignment
    `;
        return await runPowerShellCommand(command);
    };


    // 6. Désactiver (retirer) une licence
    const removeLicenseFromUser = async (userPrincipalName, skuId) => {
        const command = `
            $user = Get-AzureADUser -Filter "UserPrincipalName eq '${userPrincipalName}'"
            Set-AzureADUserLicense -ObjectId $user.ObjectId -AssignedLicenses @{AddLicenses=@(); RemoveLicenses=@("${skuId}")}
        `;
        return await runPowerShellCommand(command);
    };

    // ✅ Fonction périodique pour récupérer tous les utilisateurs
    const pollUsers = async () => {
        const command = `Get-AzureADUser | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 src/main/resources/scripts/powershell/response.json`;
        return await runPowerShellCommand(command);
    };

    const startUserPolling = (interval = 60000) => { // par défaut toutes les 60s
        if (pollingRef.current) return; // éviter plusieurs intervalles
        pollingRef.current = setInterval(() => {
            pollUsers();
        }, interval);
        console.log("⏳ Polling AzureAD users démarré...");
    };

    const stopUserPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            console.log("🛑 Polling AzureAD users arrêté.");
        }
    };

    // Arrêter le polling quand le provider est démonté
    useEffect(() => {
        return () => stopUserPolling();
    }, []);

    return (
        <AzureADContext.Provider
            value={{
                loading,
                output,
                runPowerShellCommand,
                getAvailableSKUs,
                checkUserExists,
                createAzureUser,
                getUserObjectId,
                assignLicenseToUser,
                removeLicenseFromUser,
                pollUsers,
                startUserPolling,
                stopUserPolling,
                getADUsers
            }}
        >
            {children}
        </AzureADContext.Provider>
    );
};