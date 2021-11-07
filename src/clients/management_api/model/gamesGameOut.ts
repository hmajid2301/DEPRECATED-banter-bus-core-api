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


export interface GamesGameOut { 
    /**
     * If set to true the game is enabled.
     */
    enabled?: boolean;
    /**
     * The name of the new game.
     */
    name?: string;
    /**
     * The URL to the rules of the game.
     */
    rules_url?: string;
}