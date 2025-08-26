import { convertDistance, defaultUnit } from "../utils/_module.mjs";

/**
 * Extension of core's scene type adding some localization methods.
 */
export default class BlackFlagScene extends Scene {
	/* <><><><> <><><><> <><><><> <><><><> */
	/*        Socket Event Handlers        */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _preCreate(data, options, user) {
		if ((await super._preCreate(data, options, user)) === false) return false;

		// Set default grid units based on metric length setting
		const units = defaultUnit("distance");
		if (
			units !== game.system.grid.units &&
			!foundry.utils.getProperty(data, "grid.distance") &&
			!foundry.utils.getProperty(data, "grid.units")
		) {
			this.updateSource({
				grid: {
					distance: convertDistance(game.system.grid.distance, game.system.grid.units, { to: units }).value,
					units
				}
			});
		}
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Set up any hooks relevant to scene rendering.
	 */
	static setupHooks() {
		Hooks.on("renderSceneConfig", this.renderSceneConfig);
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Modify the scene configuration app.
	 * @param {SceneConfig} app
	 * @param {HTMLElement} html
	 * @param {ApplicationRenderContext} context
	 * @param {ApplicationRenderOptions} options
	 */
	static renderSceneConfig(app, html, context, options) {
		const field = app.document.schema.fields.grid.fields.units;
		const input = html.querySelector('[name="grid.units"]');
		if (!field || !input) return;
		input.replaceWith(
			field.toInput({
				required: true,
				blank: false,
				options: CONFIG.BlackFlag.distanceUnits.localizedOptions,
				value: input.value
			})
		);
	}
}
