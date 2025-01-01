import "./styles.css";

import React, { useState } from "react";
import { Meta, Story } from "@storybook/react";

import FontPicker from "../dist/FontPicker.es";
// import '../../font-manager/src/picker-styles/styles.scss'; // Import styles

const API_KEY = "AIzaSyAOkdDlx49HCSBdu86oe8AD1Q7piIxlR6k";

const OnePicker = () => {
  const [activeFontFamily, setActiveFontFamily] = useState("Open Sans");
  return (
    <div className="wrapper">
      <FontPicker
        apiKey={API_KEY}
        activeFontFamily={activeFontFamily}
        onChange={(nextFont) => setActiveFontFamily(nextFont.family)}
      />
      <p className="apply-font">The font will be applied to this text.</p>
    </div>
  );
};

const TwoPickers = () => {
  const [activeFontFamily1, setActiveFontFamily1] = useState("Open Sans");
  const [activeFontFamily2, setActiveFontFamily2] = useState("Barlow");
  return (
    <div>
      <div className="wrapper">
        <FontPicker
          apiKey={API_KEY}
          activeFontFamily={activeFontFamily1}
          onChange={(nextFont) => setActiveFontFamily1(nextFont.family)}
          pickerId="1"
        />
        <p className="apply-font-1">The font will be applied to this text.</p>
      </div>
      <div className="wrapper">
        <FontPicker
          apiKey={API_KEY}
          activeFontFamily={activeFontFamily2}
          onChange={(nextFont) => setActiveFontFamily2(nextFont.family)}
          pickerId="2"
        />
        <p className="apply-font-2">The font will be applied to this text.</p>
      </div>
    </div>
  );
};

export default {
  title: "FontPicker",
  component: FontPicker,
} as Meta;

const TemplateOne: Story = () => <OnePicker />;
const TemplateTwo: Story = () => <TwoPickers />;

export const OneFontPicker = TemplateOne.bind({});
OneFontPicker.storyName = "One font picker";

export const TwoFontPickers = TemplateTwo.bind({});
TwoFontPickers.storyName = "Two font pickers";