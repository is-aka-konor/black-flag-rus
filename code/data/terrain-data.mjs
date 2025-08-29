const { BooleanField } = foundry.data.fields;

/**
 * Extension of terrain data with support for system concepts.
 */
export default class BlackFlagTerrainData extends foundry.data.TerrainData {
	/** @inheritDoc */
	static defineSchema() {
		return {
			...super.defineSchema(),
			difficultTerrain: new BooleanField()
		};
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	static getMovementCostFunction(token, options) {
		return token.actor?.system.isCreature
			? super.getMovementCostFunction(token, options)
			: (_from, _to, distance) => distance;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static resolveTerrainEffects(effects) {
		const automation = game.settings.get(game.system.id, "tokenMeasurementAutomation");
		let data = super.resolveTerrainEffects(effects);
		if (!automation || !effects.some(e => e.name === "difficultTerrain")) return data;
		if (!data) return new this({ difficulty: 2, difficultTerrain: true });

		let difficulty = data.difficulty + 1;
		if (!Number.isFinite(difficulty)) difficulty = null;
		data.updateSource({ difficulty, difficultTerrain: true });
		return data;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	equals(other) {
		if (!(other instanceof BlackFlagTerrainData)) return false;
		return this.difficulty === other.difficulty && this.difficultTerrain === other.difficultTerrain;
	}
}
