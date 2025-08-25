import LocalizationSetting from "../../data/settings/localization-setting.mjs";
import BaseSettingsConfig from "./base-settings-config.mjs";

/**
 * An application for configuring localization settings.
 */
export default class LocalizationSettingsConfig extends BaseSettingsConfig {
	/** @override */
	static DEFAULT_OPTIONS = {
		window: {
			title: "BF.SETTINGS.LOCALIZATION.Label"
		}
	};

	/* -------------------------------------------- */
	/*  Rendering                                   */
	/* -------------------------------------------- */

	/** @inheritDoc */
	async _preparePartContext(partId, context, options) {
		context = await super._preparePartContext(partId, context, options);
		const source = game.settings.get(game.system.id, "localization");
		const systemOptions = CONFIG.BlackFlag.measurementSystems.localizedOptions;
		context.fields = Object.entries(LocalizationSetting.schema.fields).map(([name, field]) => ({
			field,
			name: `localization.${name}`,
			options: field.options.systemSetting ? systemOptions : undefined,
			value: source[name]
		}));
		console.log(context.fields);
		return context;
	}
}
