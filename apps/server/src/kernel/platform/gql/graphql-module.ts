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


import {ApolloServerPluginInlineTrace}          from "@apollo/server/plugin/inlineTrace"
import {ApolloServerPluginSubscriptionCallback} from "@apollo/server/plugin/subscriptionCallback"
import {ApolloServerPluginCacheControl}         from "@apollo/server/plugin/cacheControl"
import {ApolloServerPluginUsageReporting}       from "@apollo/server/plugin/usageReporting"
import {
	ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault,
}                                               from '@apollo/server/plugin/landingPage/default'
import {
	ApolloDriver,
	type ApolloDriverConfig,
}                                               from '@nestjs/apollo'
import {
	Module,
	OnModuleDestroy,
	OnModuleInit,
}                                               from '@nestjs/common'
import {GraphQLModule}                             from '@nestjs/graphql'
import {join}                                      from 'node:path'
import process                                     from 'node:process'
import {isDevelopment}                             from '../../../configs/helper/is-development.js'
import {StaticFeatureFlags}                        from '../../../configs/static-feature-flags.js'
import {FooResolver}                               from '../../../http/graphql/hello-world-resolver.js'

const landingPageGraphQLPlayground = isDevelopment() ? ApolloServerPluginLandingPageLocalDefault() : ApolloServerPluginLandingPageProductionDefault({})

@Module({
	        imports  : [
		        GraphQLModule.forRoot<ApolloDriverConfig>({
			                                                  driver                           : ApolloDriver,
			                                                  autoSchemaFile                   : join(process.cwd(), 'schema.gql'),
			                                                  playground                       : false,
											status400ForVariableCoercionErrors: true,
					inheritResolversFromInterfaces	: true,
			                                                  plugins                          : [
																  landingPageGraphQLPlayground as any,
				                                                  ApolloServerPluginCacheControl(),
																  //ApolloServerPluginUsageReporting({}),
																  ApolloServerPluginInlineTrace(),
																  ApolloServerPluginSubscriptionCallback(),
			                                                  ],
			                                                  allowBatchedHttpRequests         : true,
			                                                  introspection                    : true,
			                                                  transformAutoSchemaFile          : true,
			                                                  autoTransformHttpErrors          : true,
			                                                  sortSchema                       : true,
			                                                  installSubscriptionHandlers      : true,
			                                                  cache                            : 'bounded',
			                                                  persistedQueries                 : {},
			                                                  stopOnTerminationSignals         : true,
			                                                  includeStacktraceInErrorResponses: isDevelopment(),
		                                                  }),
	        ],
	        providers: [FooResolver],
        })
export class GraphqlModule
	implements OnModuleInit,
	           OnModuleDestroy
{
	public onModuleDestroy(): any
	{
	}

	public onModuleInit(): any
	{
		StaticFeatureFlags.isGraphQLRunning = true
	}
}
