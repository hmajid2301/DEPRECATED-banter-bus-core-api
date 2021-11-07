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
import { TYPES } from '~/container.types';
import { Headers } from '../Headers';
import HttpResponse from '../HttpResponse';
import { IAPIConfiguration } from '../IAPIConfiguration';
import IHttpClient from '../IHttpClient';
import { AddGameInput } from '../model/addGameInput';
import { GamesGameOut } from '../model/gamesGameOut';






@injectable()
export class GameService {
    private basePath: string = 'http://localhost';

    constructor(@inject(TYPES.HttpClient) private httpClient: IHttpClient,
        @inject(TYPES.ApiConfiguration) private APIConfiguration: IAPIConfiguration ) {
        if(this.APIConfiguration.basePath)
            this.basePath = this.APIConfiguration.basePath;
    }

    /**
     * Create a new game.
     *
     * @param addGameInput

     */
    public addGame(addGameInput?: AddGameInput, observe?: 'body', headers?: Headers): Observable<object>;
    public addGame(addGameInput?: AddGameInput, observe?: 'response', headers?: Headers): Observable<HttpResponse<object>>;
    public addGame(addGameInput?: AddGameInput, observe: any = 'body', headers: Headers = {}): Observable<any> {
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const response: Observable<HttpResponse<object>> = this.httpClient.post(`${this.basePath}/game`, addGameInput , headers);
        if (observe === 'body') {
               return response.pipe(
                   map((httpResponse: HttpResponse) => <object>(httpResponse.response))
               );
        }
        return response;
    }


    /**
     * Disables a game.
     *
     * @param gameName The name of the game.

     */
    public disableGame(gameName: string, observe?: 'body', headers?: Headers): Observable<object>;
    public disableGame(gameName: string, observe?: 'response', headers?: Headers): Observable<HttpResponse<object>>;
    public disableGame(gameName: string, observe: any = 'body', headers: Headers = {}): Observable<any> {
        if (gameName === null || gameName === undefined){
            throw new Error('Required parameter gameName was null or undefined when calling disableGame.');
        }

        headers['Accept'] = 'application/json';

        const response: Observable<HttpResponse<object>> = this.httpClient.put(`${this.basePath}/game/${encodeURIComponent(String(gameName))}/disable`, headers);
        if (observe === 'body') {
               return response.pipe(
                   map((httpResponse: HttpResponse) => <object>(httpResponse.response))
               );
        }
        return response;
    }


    /**
     * Enables a game.
     *
     * @param gameName The name of the game.

     */
    public enableGame(gameName: string, observe?: 'body', headers?: Headers): Observable<object>;
    public enableGame(gameName: string, observe?: 'response', headers?: Headers): Observable<HttpResponse<object>>;
    public enableGame(gameName: string, observe: any = 'body', headers: Headers = {}): Observable<any> {
        if (gameName === null || gameName === undefined){
            throw new Error('Required parameter gameName was null or undefined when calling enableGame.');
        }

        headers['Accept'] = 'application/json';

        const response: Observable<HttpResponse<object>> = this.httpClient.put(`${this.basePath}/game/${encodeURIComponent(String(gameName))}/enable`, headers);
        if (observe === 'body') {
               return response.pipe(
                   map((httpResponse: HttpResponse) => <object>(httpResponse.response))
               );
        }
        return response;
    }


    /**
     * Get a game.
     *
     * @param gameName The name of the game.

     */
    public getGame(gameName: string, observe?: 'body', headers?: Headers): Observable<GamesGameOut>;
    public getGame(gameName: string, observe?: 'response', headers?: Headers): Observable<HttpResponse<GamesGameOut>>;
    public getGame(gameName: string, observe: any = 'body', headers: Headers = {}): Observable<any> {
        if (gameName === null || gameName === undefined){
            throw new Error('Required parameter gameName was null or undefined when calling getGame.');
        }

        headers['Accept'] = 'application/json';

        const response: Observable<HttpResponse<GamesGameOut>> = this.httpClient.get(`${this.basePath}/game/${encodeURIComponent(String(gameName))}`, headers);
        if (observe === 'body') {
               return response.pipe(
                   map((httpResponse: HttpResponse) => <GamesGameOut>(httpResponse.response))
               );
        }
        return response;
    }


    /**
     * Get all games.
     *
     * @param games

     */
    public getGames(games?: 'enabled' | 'disabled' | 'all', observe?: 'body', headers?: Headers): Observable<Array<string>>;
    public getGames(games?: 'enabled' | 'disabled' | 'all', observe?: 'response', headers?: Headers): Observable<HttpResponse<Array<string>>>;
    public getGames(games?: 'enabled' | 'disabled' | 'all', observe: any = 'body', headers: Headers = {}): Observable<any> {
        let queryParameters: string[] = [];
        if (games !== undefined) {
            queryParameters.push('games='+encodeURIComponent(String(games)));
        }

        headers['Accept'] = 'application/json';

        const response: Observable<HttpResponse<Array<string>>> = this.httpClient.get(`${this.basePath}/game?${queryParameters.join('&')}`, headers);
        if (observe === 'body') {
               return response.pipe(
                   map((httpResponse: HttpResponse) => <Array<string>>(httpResponse.response))
               );
        }
        return response;
    }


    /**
     * Delete a game.
     *
     * @param gameName The name of the game.

     */
    public removeGame(gameName: string, observe?: 'body', headers?: Headers): Observable<object>;
    public removeGame(gameName: string, observe?: 'response', headers?: Headers): Observable<HttpResponse<object>>;
    public removeGame(gameName: string, observe: any = 'body', headers: Headers = {}): Observable<any> {
        if (gameName === null || gameName === undefined){
            throw new Error('Required parameter gameName was null or undefined when calling removeGame.');
        }

        headers['Accept'] = 'application/json';

        const response: Observable<HttpResponse<object>> = this.httpClient.delete(`${this.basePath}/game/${encodeURIComponent(String(gameName))}`, headers);
        if (observe === 'body') {
               return response.pipe(
                   map((httpResponse: HttpResponse) => <object>(httpResponse.response))
               );
        }
        return response;
    }

}
