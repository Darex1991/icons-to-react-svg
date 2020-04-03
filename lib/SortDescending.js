"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var SortDescending = function SortDescending(props) {
  var color = props.color,
      size = props.size,
      others = _objectWithoutPropertiesLoose(props, ["color", "size"]);

  return /*#__PURE__*/_react.default.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    fill: color
  }, others, {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 1024 1024"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M528.64 875.093L741.973 610.56a21.2 21.2 0 0 0 4.585-13.214c0-6.718-3.105-12.71-7.958-16.62l-.041-.032a21.62 21.62 0 0 0-13.212-4.693H575.999V149.334c0-11.782-9.551-21.333-21.333-21.333h-85.333c-11.782 0-21.333 9.551-21.333 21.333v426.667H298.667c-11.782 0-21.333 9.551-21.333 21.333a21.676 21.676 0 0 0 4.727 13.271l-.034-.044L495.36 875.094c3.942 4.894 9.935 7.999 16.652 7.999 5.011 0 9.618-1.727 13.258-4.619l-.044.034z"
  }));
};

SortDescending.propTypes = {
  /**
   * Hex color or color name
   */
  color: _propTypes.default.string,

  /**
   * The size of the Icon.
   */
  size: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
};
SortDescending.defaultProps = {
  color: 'currentColor',
  size: '24'
};
var _default = SortDescending;
exports.default = _default;