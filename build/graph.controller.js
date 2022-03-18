"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphController = void 0;
const graphql_request_1 = require("graphql-request");
const ajv_1 = __importDefault(require("ajv"));
class GraphController {
    constructor() {
    }
    query(subgraph, contract) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = "appAddress:" + contract + "-vote:0x0";
            const query = (0, graphql_request_1.gql) `
        {
            vote(id:"` + id + `") {
              id
              orgAddress
              appAddress
              creator
              metadata
              executed
              executedAt
              startDate
              snapshotBlock
              supportRequiredPct
              minAcceptQuorum
              yea
              nay
              votingPower
              script
              voteNum
              castVotes {
                id
                voter {
                  id          
                  address
                }
                supports
                stake
                createdAt
              }
            }
        }
    `;
            return yield (0, graphql_request_1.request)(subgraph, query);
        });
    }
    validate(entry) {
        // let typeDefs = `
        //     type Query {
        //         id: ID!
        //         vote: Vote!
        //     }
        //     type Vote @entity {
        //         id: ID!
        //         transactionHash: [Int]!
        //         orgAddress: [Int]!
        //         appAddress: [Int]!
        //         creator: [Int]!
        //         metadata: String!
        //         open: Boolean!
        //         executed: Boolean!
        //         executedAt: Int!
        //         startDate: Int!
        //         snapshotBlock: Int!
        //         supportRequiredPct: Int!
        //         minAcceptQuorum: Int!
        //         yea: Int!
        //         nay: Int!
        //         votingPower: Int!
        //         script: [Int]!
        //         voteNum: Int!
        //         castVotes: [Cast!]!
        //     }
        //     type Cast @entity {
        //         id: ID!
        //         voter: Voter!
        //         supports: Boolean!
        //         stake: Int!
        //         createdAt: Int!
        //         vote: Vote! 
        //     }
        //     type Voter @entity {
        //         id: ID!
        //         address: [Int]!
        //         castVotes: [Cast!]
        //     }
        // `;
        let jsonSchema = {
            "$schema": "",
            "$ref": "#/definitions/votes",
            "definitions": {
                "votes": {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                        "id": {
                            "type": "string"
                        },
                        "orgAddress": {
                            "type": "string"
                        },
                        "appAddress": {
                            "type": "string"
                        },
                        "creator": {
                            "type": "string"
                        },
                        "metadata": {
                            "type": "string"
                        },
                        "executed": {
                            "type": "boolean"
                        },
                        "executedAt": {
                            "type": "string"
                        },
                        "startDate": {
                            "type": "string",
                        },
                        "snapshotBlock": {
                            "type": "string",
                        },
                        "supportRequiredPct": {
                            "type": "string"
                        },
                        "minAcceptQuorum": {
                            "type": "string"
                        },
                        "yea": {
                            "type": "string"
                        },
                        "nay": {
                            "type": "string",
                        },
                        "votingPower": {
                            "type": "string"
                        },
                        "script": {
                            "type": "string"
                        },
                        "voteNum": {
                            "type": "string",
                        },
                        "castVotes": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/CastVote"
                            }
                        }
                    },
                    "required": [
                        "appAddress",
                        "castVotes",
                        "creator",
                        "executed",
                        "executedAt",
                        "id",
                        "metadata",
                        "minAcceptQuorum",
                        "nay",
                        "orgAddress",
                        "script",
                        "snapshotBlock",
                        "startDate",
                        "supportRequiredPct",
                        "voteNum",
                        "votingPower",
                        "yea"
                    ],
                    "title": "votes"
                },
                "CastVote": {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                        "id": {
                            "type": "string"
                        },
                        "voter": {
                            "$ref": "#/definitions/Voter"
                        },
                        "supports": {
                            "type": "boolean"
                        },
                        "stake": {
                            "type": "string"
                        },
                        "createdAt": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "createdAt",
                        "id",
                        "stake",
                        "supports",
                        "voter"
                    ],
                    "title": "CastVote"
                },
                "Voter": {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                        "id": {
                            "type": "string"
                        },
                        "address": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "address",
                        "id"
                    ],
                    "title": "Voter"
                }
            }
        };
        if (entry.vote !== undefined) {
            const ajv = new ajv_1.default();
            const validate = ajv.compile(jsonSchema);
            const valid = validate(entry.vote);
            if (!valid)
                console.log(validate.errors);
            return valid;
        }
        return false;
    }
}
exports.GraphController = GraphController;
