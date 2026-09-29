import { describe, expect, test } from "vitest";
import {
    rowsToSave,
    createPPEMap,
    ppeService
} from "../../lib/services/ppeService";

describe("ppeService", () => {

    test("crea una fila por cada combinación de queen y episodio", () => {
        const queens = [
            { id: "queen1" },
            { id: "queen2" }
        ];

        const episodes = [
            { id: "episode1" },
            { id: "episode2" }
        ];

        const pointsMap = new Map();

        const result = rowsToSave(queens, episodes, pointsMap);

        expect(result).toHaveLength(4);

        expect(result).toEqual([
            {
                queen_id: "queen1",
                episode_id: "episode1",
                point_type_id: null
            },
            {
                queen_id: "queen1",
                episode_id: "episode2",
                point_type_id: null
            },
            {
                queen_id: "queen2",
                episode_id: "episode1",
                point_type_id: null
            },
            {
                queen_id: "queen2",
                episode_id: "episode2",
                point_type_id: null
            }
        ]);
    });

    test("asigna el point_type_id cuando existe una puntuación", () => {
        const queens = [
            { id: "queen1" }
        ];

        const episodes = [
            { id: "episode1" },
            { id: "episode2" }
        ];

        const pointsMap = new Map();

        pointsMap.set("queen1|episode1", {
            id: "point1"
        });

        const result = rowsToSave(
            queens,
            episodes,
            pointsMap
        );

        expect(result).toEqual([
            {
                queen_id: "queen1",
                episode_id: "episode1",
                point_type_id: "point1"
            },
            {
                queen_id: "queen1",
                episode_id: "episode2",
                point_type_id: null
            }
        ]);
    });

    test("crea un mapa con las puntuaciones de cada queen y episodio", () => {
        const ranking = [
            {
                ppe_reference: {
                    queen_id: {
                        id: "queen1"
                    },
                    episode_id: {
                        id: "episode1"
                    }
                },
                point_type_id: {
                    id: "point1"
                }
            }
        ];

        const pointTypes = [
            {
                id: "point1",
                name: "WIN",
                value: 5
            }
        ];

        const result = createPPEMap(ranking, pointTypes);

        expect(result.get("queen1|episode1")).toEqual(pointTypes[0]);
    });

    test("ignora una puntuación cuyo point_type no existe", () => {
        const ranking = [
            {
                ppe_reference: {
                    queen_id: {
                        id: "queen1"
                    },
                    episode_id: {
                        id: "episode1"
                    }
                },
                point_type_id: {
                    id: "point999"
                }
            }
        ];

        const pointTypes = [
            {
                id: "point1",
                name: "WIN",
                value: 5
            }
        ];

        const result = createPPEMap(ranking, pointTypes);

        expect(result.has("queen1|episode1")).toBe(false);
    });

    test("devuelve la queen con point9 como ganadora", async () => {
        const ranking = new Map([
            [
                "queen1|episode1",
                {
                    id: "point1",
                    name: "WIN",
                    value: 5
                }
            ],
            [
                "queen2|episode1",
                {
                    id: "point9",
                    name: "WINNER",
                    value: 0
                }
            ]
        ]);

        ppeService.getRanking = async () => ranking;

        const season = {
            id: "season1"
        };

        const pointTypes = [];

        const result = await ppeService.getSeasonWinner(
            season,
            pointTypes
        );

        expect(result).toBe("queen2");
    });

    test("devuelve la queen con mayor puntuación cuando no existe point9", async () => {
        const ranking = new Map([
            [
                "queen1|episode1",
                {
                    id: "point1",
                    name: "WIN",
                    value: 5
                }
            ],
            [
                "queen1|episode2",
                {
                    id: "point2",
                    name: "TOP2",
                    value: 4.5
                }
            ],
            [
                "queen2|episode1",
                {
                    id: "point1",
                    name: "WIN",
                    value: 5
                }
            ],
            [
                "queen2|episode2",
                {
                    id: "point1",
                    name: "WIN",
                    value: 5
                }
            ]
        ]);

        ppeService.getRanking = async () => ranking;

        const season = {
            id: "season1"
        };

        const pointTypes = [];

        const result = await ppeService.getSeasonWinner(
            season,
            pointTypes
        );

        expect(result).toBe("queen2");
    });

    test("devuelve null cuando no hay puntuaciones", async () => {
        const ranking = new Map();

        ppeService.getRanking = async () => ranking;

        const season = {
            id: "season1"
        };

        const pointTypes = [];

        const result = await ppeService.getSeasonWinner(
            season,
            pointTypes
        );

        expect(result).toBeNull();
    });
});