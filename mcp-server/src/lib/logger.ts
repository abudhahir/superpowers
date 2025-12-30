import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { loadConfig } from './config.js';

/**
 * Gets the path to a log file
 *
 * @param filename - Name of the log file
 * @returns Full path to the log file
 */
function getLogPath(filename: string): string {
  const logDir = process.env.SUPREMEPOWER_LOG_PATH
    ? path.join(process.env.SUPREMEPOWER_LOG_PATH, 'logs')
    : path.join(os.homedir(), '.supremepower', 'logs');
  return path.join(logDir, filename);
}

/**
 * Ensures the log directory exists
 */
async function ensureLogDir(): Promise<void> {
  const logDir = path.dirname(getLogPath('dummy.log'));
  await fs.mkdir(logDir, { recursive: true });
}

/**
 * Logs an error message to error.log
 *
 * @param message - Error message to log
 * @param error - Optional Error object with stack trace
 */
export async function logError(message: string, error?: Error): Promise<void> {
  await ensureLogDir();
  const logPath = getLogPath('error.log');

  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n${error?.stack || ''}\n\n`;

  await fs.appendFile(logPath, logEntry, 'utf8');
}

/**
 * Logs orchestration details to orchestration.log when verbose mode is enabled
 *
 * @param details - Orchestration details to log
 */
export async function logOrchestration(details: any): Promise<void> {
  const config = await loadConfig();

  if (!config.display.verbose) {
    return; // Only log if verbose mode enabled
  }

  await ensureLogDir();
  const logPath = getLogPath('orchestration.log');

  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${JSON.stringify(details, null, 2)}\n\n`;

  await fs.appendFile(logPath, logEntry, 'utf8');
}

/**
 * Logs a crash to a dated crash log file
 *
 * @param error - Error object with stack trace
 */
export async function logCrash(error: Error): Promise<void> {
  await ensureLogDir();
  const date = new Date().toISOString().split('T')[0];
  const logPath = getLogPath(`crash-${date}.log`);

  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] CRASH\n${error.stack}\n\n`;

  await fs.appendFile(logPath, logEntry, 'utf8');
}
