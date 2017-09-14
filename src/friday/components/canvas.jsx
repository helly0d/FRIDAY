import React, {Component} from "react";

const styles = {
  width: "100%",
  height: "100%",
  background: "#000"
};

export default class Canvas extends Component {
  render() {
    return (
      <canvas style={styles}> </canvas>
    );
  }
}
