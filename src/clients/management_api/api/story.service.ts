/**
 * Banter Bus Management API
 * The API specification for the Banter Bus Management API.
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Headers } from '../Headers';
import HttpResponse from '../HttpResponse';
import { IAPIConfiguration } from '../IAPIConfiguration';
import IHttpClient from '../IHttpClient';
import { AddStoryInput } from '../model/addStoryInput';
import { StoryStoryInOut } from '../model/storyStoryInOut';






@injectable()
export class StoryService {
    private basePath: string = 'http://localhost';

    constructor(@inject('IApiHttpClient') private httpClient: IHttpClient,
        @inject('IAPIConfiguration') private APIConfiguration: IAPIConfiguration ) {
        if(this.APIConfiguration.basePath)
            this.basePath = this.APIConfiguration.basePath;
    }

    /**
     * Add a story.
     *
     * @param gameName The name of the game.
     * @param addStoryInput

     */
    public addStory(gameName: string, addStoryInput?: AddStoryInput, observe?: 'body', headers?: Headers): Observable<string>;
    public addStory(gameName: string, addStoryInput?: AddStoryInput, observe?: 'response', headers?: Headers): Observable<HttpResponse<string>>;
    public addStory(gameName: string, addStoryInput?: AddStoryInput, observe: any = 'body', headers: Headers = {}): Observable<any> {
        if (gameName === null || gameName === undefined){
            throw new Error('Required parameter gameName was null or undefined when calling addStory.');
        }

        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const response: Observable<HttpResponse<string>> = this.httpClient.post(`${this.basePath}/story/${encodeURIComponent(String(gameName))}`, addStoryInput , headers);
        if (observe === 'body') {
               return response.pipe(
                   map((httpResponse: HttpResponse) => <string>(httpResponse.response))
               );
        }
        return response;
    }


    /**
     * Delete a story.
     *
     * @param gameName The name of the game.
     * @param storyId The id for the story.

     */
    public deleteStory(gameName: string, storyId: string, observe?: 'body', headers?: Headers): Observable<any>;
    public deleteStory(gameName: string, storyId: string, observe?: 'response', headers?: Headers): Observable<HttpResponse<any>>;
    public deleteStory(gameName: string, storyId: string, observe: any = 'body', headers: Headers = {}): Observable<any> {
        if (gameName === null || gameName === undefined){
            throw new Error('Required parameter gameName was null or undefined when calling deleteStory.');
        }

        if (storyId === null || storyId === undefined){
            throw new Error('Required parameter storyId was null or undefined when calling deleteStory.');
        }

        headers['Accept'] = 'application/json';

        const response: Observable<HttpResponse<any>> = this.httpClient.delete(`${this.basePath}/story/${encodeURIComponent(String(gameName))}/${encodeURIComponent(String(storyId))}`, headers);
        if (observe === 'body') {
               return response.pipe(
                   map((httpResponse: HttpResponse) => <any>(httpResponse.response))
               );
        }
        return response;
    }


    /**
     * Get a story.
     *
     * @param gameName The name of the game.
     * @param storyId The id for the story.

     */
    public getStory(gameName: string, storyId: string, observe?: 'body', headers?: Headers): Observable<StoryStoryInOut>;
    public getStory(gameName: string, storyId: string, observe?: 'response', headers?: Headers): Observable<HttpResponse<StoryStoryInOut>>;
    public getStory(gameName: string, storyId: string, observe: any = 'body', headers: Headers = {}): Observable<any> {
        if (gameName === null || gameName === undefined){
            throw new Error('Required parameter gameName was null or undefined when calling getStory.');
        }

        if (storyId === null || storyId === undefined){
            throw new Error('Required parameter storyId was null or undefined when calling getStory.');
        }

        headers['Accept'] = 'application/json';

        const response: Observable<HttpResponse<StoryStoryInOut>> = this.httpClient.get(`${this.basePath}/story/${encodeURIComponent(String(gameName))}/${encodeURIComponent(String(storyId))}`, headers);
        if (observe === 'body') {
               return response.pipe(
                   map((httpResponse: HttpResponse) => <StoryStoryInOut>(httpResponse.response))
               );
        }
        return response;
    }

}