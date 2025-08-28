const { NumberField, SchemaField } = foundry.data.fields;

/**
 * Data definition template for non-PC actors with hit points.
 *
 * @property {object} attributes
 * @property {object} attributes.hp
 * @property {number} attributes.hp.max - Maximum hit points.
 * @property {number} attributes.hp.temp - Temporary hit points.
 * @property {number} attributes.hp.tempMax - Temporary max hit points.
 * @property {number} attributes.hp.value - Current hit points.
 */
export default class HPTemplate extends foundry.abstract.DataModel {
	/** @inheritDoc */
	static defineSchema() {
		return {
			attributes: new SchemaField({
				hp: new SchemaField(
					{
						max: new NumberField({ required: true, min: 0, integer: true, label: "BF.HitPoint.Max.LabelLong" }),
						temp: new NumberField({ required: true, min: 0, integer: true, label: "BF.HitPoint.Temp.LabelLong" }),
						tempMax: new NumberField({ required: true, integer: true, label: "BF.HitPoint.TempMax.LabelLong" }),
						value: new NumberField({ required: true, min: 0, integer: true, label: "BF.HitPoint.Current.LabelLong" })
					},
					{ label: "BF.HitPoint.Label[other]" }
				)
			})
		};
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*           Data Preparation          */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare the hit points data during the `prepareDerivedData` stage.
	 */
	prepareDerivedHitPoints() {
		const hp = this.attributes.hp;
		hp.max ??= 0;
		if ((this.attributes.exhaustion ?? 0) >= 4) hp.max = Math.floor(hp.max * 0.5);
		hp.baseMax = hp.max;
		hp.max += hp.tempMax ?? 0;
		hp.value = Math.clamp(hp.value, 0, hp.max);
		hp.damage = hp.max - hp.value;
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*        Socket Event Handlers        */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Track changes to HP when updated.
	 * @param {object} changes - The candidate changes to the Document.
	 * @param {object} options - Additional options which modify the update request.
	 * @param {BaseUser} user - The User requesting the document update.
	 */
	_preUpdateHP(changes, options, user) {
		foundry.utils.setProperty(options, `${game.system.id}.hp`, { ...this.attributes.hp });

		const changedMaxHP = foundry.utils.getProperty(changes, "system.attributes.hp.max");
		if (changedMaxHP !== undefined) {
			const maxHPDelta = changedMaxHP - this.attributes.hp.baseMax;
			foundry.utils.setProperty(changes, "system.attributes.hp.value", this.attributes.hp.value + maxHPDelta);
		}
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Display token effects and call damage hook.
	 * @param {object} changed - The differential data that was changed relative to the documents prior values.
	 * @param {object} options - Additional options which modify the update request.
	 * @param {string} userId - The id of the User requesting the document update.
	 */
	_onUpdateHP(changed, options, userId) {
		if ( !changed.system?.attributes?.hp ) return;

		const hp = options[game.system.id]?.hp;
		if ( hp && !options.isAdvancement && !options.isRest ) {
			const curr = this.attributes.hp;
			const changes = {
				hp: curr.value - hp.value,
				temp: curr.temp - hp.temp
			};
			changes.total = changes.hp + changes.temp;

			if ( Number.isInteger(changes.total) && (changes.total !== 0) ) {
				this.parent._displayTokenEffect(changes);

				/**
				 * A hook event that fires when an actor is damaged or healed by any means. The actual name
				 * of the hook will depend on the change in hit points.
				 * @function blackFlag.damageActor
				 * @function blackFlag.healActor
				 * @memberof hookEvents
				 * @param {BlackFlagActor} actor - The actor that had their hit points reduced.
				 * @param {{ hp: number, temp: number, total: number }} changes - The changes to hit points.
				 * @param {object} update - The original update delta.
				 * @param {string} userId - ID of the user that performed the update.
				 */
				Hooks.callAll(`blackFlag.${changes.total > 0 ? "heal" : "damage"}Actor`, this.parent, changes, changed, userId);
			}
		}
	}
}
