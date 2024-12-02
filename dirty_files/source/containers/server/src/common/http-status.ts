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

/**
 * @see [RFC 7231, Section 6.1](https://datatracker.ietf.org/doc/html/rfc7231#section-6)
 */
export enum HttpStatus
{
	/**   The 100 (Continue) status code indicates that the initial part of a
   request has been received and has not yet been rejected by the
   server.  The server intends to send a final response after the
   request has been fully received and acted upon. */
	CONTINUE                      = 100,
	SWITCHING_PROTOCOLS           = 101,
	OK                            = 200,
	CREATED                       = 201,
	ACCEPTED                      = 202,
	NON_AUTHORITATIVE_INFORMATION = 203,
	NO_CONTENT                    = 204,
	RESET_CONTENT                 = 205,
	PARTIAL_CONTENT               = 206,
	MULTIPLE_CHOICES              = 300,
	MOVED_PERMANENTLY             = 301,
	FOUND                         = 302,
	SEE_OTHER                     = 303,
	NOT_MODIFIED                  = 304,
	USE_PROXY                     = 305,
	TEMPORARY_REDIRECT            = 307,
	BAD_REQUEST                   = 400,
	UNAUTHORIZED                  = 401,
	NOT_FOUND                     = 404,
	CONFLICT                      = 409,
	INTERNAL_SERVER_ERROR         = 500,

}
