import { isInstalled } from "../project/detect-installed-package.js";
import { detectPackageManager } from "../project/detect-package-manager.js";
import getInstallCommand from "../project/get-install-command.js";
import { runCommand } from "./run-command.js";

export async function installDependencies(
  dependencies: { package: string; version?: string }[]
) {
    try{
        const pm = detectPackageManager();
        console.log("\n- Checking dependencies...");
        
        const toInstall = dependencies.filter(
            d => !isInstalled(d.package, d.version)
        );
        console.log("- Dependencies to install: ", toInstall);
        
        if (toInstall.length === 0) {
            console.log("\n✅ All dependencies already installed.\n");
            return true;
        }
        
        const command = getInstallCommand(pm, toInstall);
        console.log("- Install command: ", command);
      
        console.log(`- Installing with ${pm}...`);
        console.log(command);
      
        await runCommand(command);
        console.log("\n✅ All Dependencies installed successfully.\n");
        return true;
    } catch(e){
        console.log("\n❌ Failed to Install dependencies. Error: ", e, "\n");
        return false;
    }
}
