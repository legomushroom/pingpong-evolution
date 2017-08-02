/**
 * `getRadialPoint` - function to get a point on imaginary circle
 *                    with provided parameters.
 *
 * `Note:` This function is explicetely recieves a target object to set
 *         the result on, this was made because producing a lot of
 *          new return objects on every animation frame will cause GC issues.
 *
 * @param {Number} centerX Circle's center `x` coordinate.
 * @param {Number} centerY Circle's center `y` coordinate.
 * @param {Number} radius Circle's radius.
 * @param {Number} angle Angle of a line from center to a point.
 * @return {Object} New point coordinates
 */
export const getRadialPoint = (centerX, centerY, radius, angle) => {
  const radAngle = (angle - 90) * 0.017453292519943295; // Math.PI / 180

  return {
    x: centerX + (Math.cos(radAngle) * radius),
    y: centerY + (Math.sin(radAngle) * radius)
  };
};
