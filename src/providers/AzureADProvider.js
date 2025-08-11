import React, { createContext, useContext, useState } from 'react';
import { Ajax } from '../services/ajax';

const AzureADContext = createContext();

export const useAzureAD = () => useContext(AzureADContext);

export const AzureADProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");

    const runPowerShellCommand = async (command) => {
        setLoading(true);
        try {
            const response = await Ajax.postRequest('/api/powershell/run', {command: command});
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
        const command = `Get-AzureADSubscribedSku | Select SkuPartNumber, SkuId | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 src/main/resources/scripts/powershell/response.json`;
        return await runPowerShellCommand(command);
    };

    // 2. Vérifier si l'utilisateur existe
    const checkUserExists = async (userPrincipalName) => {
        const command = `Get-AzureADUser -Filter "UserPrincipalName eq '${userPrincipalName}'" | Select ObjectId, UserPrincipalName | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 src/main/resources/scripts/powershell/response.json`;
        return await runPowerShellCommand(command);
    };

    // 3. Créer un utilisateur s’il n’existe pas
    const createUser = async ({ displayName, userPrincipalName, password }) => {
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

        $license = New-Object -TypeName Microsoft.Open.AzureAD.Model.AssignedLicense
        $license.SkuId = "${skuId}"

        $licenseAssignment = New-Object -TypeName Microsoft.Open.AzureAD.Model.AssignedLicenses
        $licenseAssignment.AddLicenses = @($license)
        $licenseAssignment.RemoveLicenses = @()

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

    return (
        <AzureADContext.Provider
            value={{
                loading,
                output,
                runPowerShellCommand,
                getAvailableSKUs,
                checkUserExists,
                createUser,
                getUserObjectId,
                assignLicenseToUser,
                removeLicenseFromUser
            }}
        >
            {children}
        </AzureADContext.Provider>
    );
};