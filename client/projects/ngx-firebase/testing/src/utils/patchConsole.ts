/**
 * Monkey patch console warn and error to fail if a test makes calls to console.warn or console.error.
 */
export function patchConsole(): void {
    console.warn = (message?: any, ...optionalParams: any[]) => {
        const params = optionalParams ? `\nParams: ${optionalParams}` : '';
        fail(`Test contained console warning:\n${message}${params}`);
    };
    console.error = (message?: any, ...optionalParams: any[]) => {
        const params = optionalParams ? `\nParams: ${optionalParams}` : '';
        fail(`Test contained console error:\n${message}${params}`);
    };
}
