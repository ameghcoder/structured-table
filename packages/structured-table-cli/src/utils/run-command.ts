import { exec as execCb } from "child_process";
import { promisify } from "util";

const exec = promisify(execCb);

export async function runCommand(cmd: string) {
    try{    
        const { stdout, stderr } = await exec(cmd, {
            cwd: process.cwd()  
        });

        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
    } catch (err: any) {
        console.error("Command failed:", cmd);
        console.error("\nError: ", err);
        throw err;
    }
}
