/*
 * MIT License
 *
 * Copyright (c) 2024 Jakub Olan <keinsell@protonmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import fs           from 'fs/promises'
import path         from 'path'
import process      from 'process'
import ps           from 'ps-node'
import type { PID } from './PID.js'



interface LockManagerOptions
  {
	 lockFileName? : string;
	 lockFileDir? : string;
	 killTimeout? : number;
	 waitForExitTimeout? : number;
	 checkInterval? : number;
	 maxRetries? : number;
	 defaultAnswer? : string;
  }


/**
 * Manages a lock file to ensure single-instance execution of the application.
 */
export class ProcessLockManager
  {
	 static $defaults                        = {
		lockFileName       : '.node.pid.lock',
		lockFileDir        : process.cwd(),
		killTimeout        : 5000,
		waitForExitTimeout : 10000,
		checkInterval      : 500,
		maxRetries         : 3,
		defaultAnswer      : 'yes',
	 }
	 private pid : number
	 private lockFilePath : string
	 private killTimeout : number
	 private waitForExitTimeout : number
	 private checkInterval : number
	 private maxRetries : number
	 private defaultAnswer : string
	 private lockFile : fs.FileHandle | null = null
	 private lockAcquired : boolean
	 private otherProcessExited : boolean

	 /**
	  * Constructor for LockManager class.
	  *
	  * @param {Object} options - Configuration options.
	  * @param {string} [options.lockFileName='app.lock'] - Name of the lock file.
	  * @param {string} [options.lockFileDir=__dirname] - Directory for the lock file.
	  * @param {number} [options.killTimeout=5000] - Timeout for killing another instance.
	  * @param {number} [options.waitForExitTimeout=10000] - Timeout for waiting for another process to exit.
	  * @param {number} [options.checkInterval=500] - Interval for checking if another process is running.
	  * @param {number} [options.maxRetries=3] - Maximum number of retries for acquiring the lock.
	  * @param {string} [options.defaultAnswer='yes'] - Default answer for user prompts.
	  */
	 constructor(private options : LockManagerOptions = ProcessLockManager.$defaults)
		{


		  const settings                  = {...ProcessLockManager.$defaults, ...options}
		  this.lockFilePath               = path.join( settings.lockFileDir, settings.lockFileName )
		  this.options.killTimeout        = settings.killTimeout
		  this.options.waitForExitTimeout = settings.waitForExitTimeout
		  this.options.checkInterval      = settings.checkInterval
		  this.options.maxRetries         = settings.maxRetries
		  this.options.defaultAnswer      = settings.defaultAnswer
		  this.lockAcquired               = false
		  this.pid                        = process.pid
		  this.otherProcessExited         = false
		}

	 /**
	  * Checks if a lock file exists and if the process it represents is still running.
	  * If another instance is running, prompts the user to kill it.
	  *
	  * @returns {Promise<void>} - Resolves when the lock status is checked.
	  */
	 async checkLock()
		{
		  try
			 {
				const lockData = await fs.readFile( this.lockFilePath, 'utf8' )
				let storedPid  = parseInt( lockData.trim(), 10 ) as PID

				if ( isNaN( storedPid ) )
				  {
					 console.error( 'Error: Invalid PID found in the lock file. Exiting.' )
					 process.exit( 1 )
				  }

				if ( await this.isProcessRunning( storedPid ) )
				  {
					 try
						{
						  const timeout   = this.killTimeout
						  const userInput = await this.promptUserWithTimeout(
							 `Another instance is already running (PID: ${storedPid}). Do you want to kill it and start a new one? (yes/no) `,
							 timeout, this.defaultAnswer,
						  ) as string

						  if ( userInput && userInput.toLowerCase() === 'yes' )
							 {
								console.log( `Killing the old instance (PID: ${storedPid})...` )
								process.kill( storedPid, 'SIGTERM' )

								// Periodically check if the other process has exited
								await this.waitForOtherProcessExit( storedPid )

								// If the other process hasn't exited, log a message and exit
								if ( !this.otherProcessExited )
								  {
									 console.error( 'Error: Timeout waiting for the old instance to exit. Exiting.' )
									 process.exit( 1 )
								  }
							 }
						  else
							 {
								console.log( 'Exiting without starting a new instance.' )
								process.exit( 0 )
							 }
						}
					 catch ( killError )
						{
						  console.error( 'Error killing the old instance:', killError.message )
						  process.exit( 1 )
						}
				  }
				else
				  {
					 console.log( 'Lock file found, but the process is not running. Proceeding to acquire the lock.' )
				  }
			 }
		  catch ( error )
			 {
				if ( error.code !== 'ENOENT' )
				  {
					 console.error( 'Error reading lock file:', error.message )
					 process.exit( 1 )
				  }
				// Lock file doesn't exist, proceed to acquire the lock.
				console.log( 'Lock not acquired. Proceeding to acquire the lock.' )
			 }
		}

	 /**
	  * Attempts to create a lock file to indicate that the current instance is running.
	  * Retries if the lock cannot be acquired immediately.
	  *
	  * @param {number} [timeout=Infinity] - Timeout for acquiring the lock.
	  * @param {number} [maxRetries=this.maxRetries] - Maximum number of retries for acquiring the lock.
	  * @returns {Promise<void>} - Resolves when the lock is acquired.
	  */
	 async createLock(
		timeout    = Infinity,
		maxRetries = this.maxRetries,
	 )
		{
		  let startTime = Date.now()
		  let retries   = 0

		  while ( !this.lockAcquired )
			 {
				try
				  {
					 await fs.writeFile( this.lockFilePath, this.pid.toString() )
					 this.lockAcquired = true
					 console.log( `Lock acquired (PID: ${this.pid}).` )
				  }
				catch ( error )
				  {
					 retries++

					 if ( retries > maxRetries )
						{
						  console.error( 'Error: Maximum retries reached. Unable to acquire the lock. Exiting.' )
						  process.exit( 1 )
						}

					 if ( timeout !== Infinity && Date.now() - startTime > timeout )
						{
						  console.error( 'Error: Lock acquisition timed out. Unable to acquire the lock. Exiting.' )
						  process.exit( 1 )
						}

					 // Retry after a short delay
					 await new Promise( resolve => setTimeout( resolve, 100 ) )
				  }
			 }
		}

	 /**
	  * Initializes termination event handlers for graceful application shutdown.
	  *
	  * @method initializeTerminationHandlers
	  * @memberof ProcessLockManager
	  * @description This method sets up event handlers for termination signals (SIGINT, SIGTERM, and exit)
	  *              to handle the graceful termination of the application. It ensures that the lock file
	  *              is removed if it was acquired during the application's execution.
	  * @returns {void}
	  * @example
	  * const lockManager = new LockManager();
	  * lockManager.initializeTerminationHandlers();
	  */
	 initializeTerminationHandlers()
		{
		  // Save reference to the current instance for use in the event listeners.
		  const lockManagerInstance = this

		  /**
			* Handles the termination signals (SIGINT, SIGTERM, exit) for graceful shutdown.
			*
			* @function handleTermination
			* @param {string} signal - The termination signal received.
			* @returns {void}
			*/
		  function handleTermination(signal : string)
			 {
				console.info( `Received ${signal}, handling termination...` )
				// Check if the lock should be removed based on the current instance state.
				if ( lockManagerInstance.lockAcquired )
				  {
					 lockManagerInstance.removeLock()
											  .then( () => console.info( 'Lock file removed.' ) )
											  .catch( (error) => console.error( 'Error removing lock file:', error ) )
											  .finally( () => process.exit( 0 ) )
				  }
				else
				  {
					 console.info( 'Lock was not acquired. Exiting without removing lock file.' )
					 process.exit( 0 )
				  }
			 }

		  // Register termination handlers to clean up resources before exiting.
		  process.on( 'SIGINT', handleTermination )
		  process.on( 'SIGTERM', handleTermination )
		  process.on( 'exit', handleTermination )
		}


	 /**
	  * Removes the lock file, releasing the lock.
	  *
	  * @returns {Promise<void>} - Resolves when the lock is released.
	  */
	 removeLock = async () => {
		try
		  {
			 await fs.unlink( this.lockFilePath )
			 console.log( 'Lock released.' )
		  }
		catch ( error )
		  {
			 console.error( 'Error releasing the lock:', error.message )
		  }
	 }

	 /**
	  * Prompts the user with a given question and returns the user's input.
	  *
	  * @param {string} question - The question to prompt the user.
	  * @returns {Promise<string>} - Resolves with the user's input.
	  */
	 async promptUser(question : string)
		{
		  const readline = require( 'readline' ).createInterface( {
																						input  : process.stdin,
																						output : process.stdout,
																					 } )

		  return new Promise( resolve => {
			 readline.question( question, (answer : string) => {
				readline.close()
				resolve( answer.trim() )
			 } )
		  } )
		}

	 /**
	  * Waits for another process with the specified PID to exit within a timeout.
	  *
	  * @param {number} storedPid - The PID of the other process.
	  * @returns {Promise<void>} - Resolves when the other process exits.
	  */
	 async waitForOtherProcessExit(storedPid : PID)
		{
		  const timeout  = this.waitForExitTimeout
		  const interval = this.checkInterval
		  const endTime  = Date.now() + timeout

		  while ( Date.now() < endTime )
			 {
				try
				  {
					 if ( !await this.isProcessRunning( storedPid ) )
						{
						  this.otherProcessExited = true
						  return
						}
				  }
				catch ( error )
				  {
					 console.error( 'Error checking if the other process has exited:', error.message )

					 // Handle specific errors that indicate an unrecoverable situation
					 if ( error.code === 'ESRCH' || error.code === 'EPERM' )
						{
						  console.error( 'Unrecoverable error. Exiting loop.' )
						  break
						}
				  }

				await new Promise( resolve => setTimeout( resolve, interval ) )
			 }

		  // Handle the case where the other process did not exit within the timeout
		  console.error( 'Error: Timeout waiting for the other process to exit.' )
		  // Inform the user, log, or take appropriate action based on your application's requirements.
		}

	 /**
	  * Prompts the user with a timeout, returning the user's input or a default answer if no input is received.
	  *
	  * @param {string} question - The question to prompt the user.
	  * @param {number} timeout - Timeout for user input.
	  * @param {string} defaultAnswer - Default answer if no input is received.
	  * @returns {Promise<string>} - Resolves with the user's input or the default answer.
	  */
	 async promptUserWithTimeout(
		question : string,
		timeout : number,
		defaultAnswer : string,
	 ) : Promise<unknown>
		{

		  return Promise.race( [
										 this.promptUser( question ),
										 new Promise( resolve => setTimeout( () => resolve( defaultAnswer ), timeout ) ),
									  ] )
		}

	 /**
	  * Checks if a process with the specified PID is currently running.
	  *
	  * @param {number} pid - The PID of the process to check.
	  * @returns {Promise<boolean>} - Resolves with a boolean indicating whether the process is running.
	  */
	 isProcessRunning(pid : PID)
		{
		  return new Promise( (
										resolve,
										reject,
									 ) => {
			 ps.lookup( {pid : pid}, (
				err : NodeJS.ErrnoException | null,
				resultList : ps.Program[],
			 ) => {
				if ( err )
				  {
					 throw new Error( err as any )
				  }

				if ( resultList.length > 0 )
				  {
					 // Process is running
					 resolve( true )
				  }
				else
				  {
					 // Process is not running
					 resolve( false )
				  }
			 } )
		  } )
		}
  }
