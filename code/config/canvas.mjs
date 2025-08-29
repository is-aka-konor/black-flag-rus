import MapLocationControlIcon from "../canvas/map-location-control-icon.mjs";
import { localizeConfig } from "../utils/_module.mjs";

/**
 * Types of terrain that can cause difficult terrain.
 * @enum {{ label: string }}
 */
export const difficultTerrainTypes = {
	ice: {
		label: "BF.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Ice"
	},
	liquid: {
		label: "BF.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Liquid"
	},
	plants: {
		label: "BF.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Plants"
	},
	rocks: {
		label: "BF.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Rocks"
	},
	slope: {
		label: "BF.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Slope"
	},
	snow: {
		label: "BF.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Snow"
	}
};
localizeConfig(difficultTerrainTypes);

/* <><><><> <><><><> <><><><> <><><><> <><><><> <><><><> */

/**
 * Configuration data for a map marker style. Options not included will fall back to the value set in the `default`
 * style. Any additional styling options added will be passed into the custom marker class and be available for
 * rendering.
 *
 * @typedef {object} MapLocationMarkerStyle
 * @property {typeof PIXI.Container} [icon] - Map marker class used to render the icon.
 * @property {number} [backgroundColor] - Color of the background inside the circle.
 * @property {number} [borderColor] - Color of the border in normal state.
 * @property {number} [borderHoverColor] - Color of the border when hovering over the marker.
 * @property {string} [fontFamily] - Font used for rendering the code on the marker.
 * @property {number} [shadowColor] - Color of the shadow under the marker.
 * @property {number} [textColor] - Color of the text on the marker.
 */

/**
 * Styling profiles available for map markers. Default will be used as the basis and any other styles will be merged
 * on top of it if the `black-flag.mapMarkerStyle` flag is set to that style name on the journal page.
 * @enum {MapLocationMarkerStyle}
 */
export const mapLocationMarkerStyle = {
	default: {
		icon: MapLocationControlIcon,
		backgroundColor: 0xfbf8f5,
		borderColor: 0x000000,
		borderHoverColor: 0xff5500,
		fontFamily: "Open Sans",
		shadowColor: 0x000000,
		textColor: 0x000000
	}
};

/* <><><><> <><><><> <><><><> <><><><> <><><><> <><><><> */

/**
 * Colors used to visualize temporary and temporary maximum HP in token health bars.
 * @enum {number}
 */
export const tokenHPColors = {
	damage: 0xff0000,
	healing: 0x00ff00,
	temp: 0x66ccff,
	tempMaxPositive: 0x440066,
	tempMaxNegative: 0x550000
};

/* <><><><> <><><><> <><><><> <><><><> <><><><> <><><><> */

/**
 * Colors used when a dynamic token ring effects.
 * @enum {number}
 */
export const tokenRingColors = {
	damage: 0xff0000,
	defeated: 0x000000,
	healing: 0x00ff00,
	temp: 0x33aaff
};

/* <><><><> <><><><> <><><><> <><><><> <><><><> <><><><> */

/**
 * Colors used to denote movement speed on ruler segments & grid highlighting
 * @enum {number}
 */
export const tokenRulerColors = {
	normal: 0x33bc4e,
	double: 0xf1d836,
	triple: 0xe72124
};
