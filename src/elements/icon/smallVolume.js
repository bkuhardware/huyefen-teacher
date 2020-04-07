import React from 'react';
import Icon from '@ant-design/icons';

const SmallVolumnSvg = ({ size = "1em" }) => (
    <svg t="1584504844310" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24302" width={size} height={size}><path d="M557.634783 25.466435c61.885217-48.706783 109.968696-22.617043 109.968695 55.652174v852.279652c0 74.796522-48.083478 97.413565-103.112348 48.706782L317.128348 776.904348H181.426087c-77.289739 0-135.702261-62.597565-135.702261-137.394087V359.424c0-74.796522 61.840696-137.438609 135.702261-137.438609h128.845913L557.634783 25.466435z m252.527304 706.515478a39.713391 39.713391 0 0 1-32.634435-15.671652c-22.349913-22.617043-22.349913-48.706783 0-67.851131 80.762435-81.741913 80.762435-205.245217 0-286.98713-22.349913-22.617043-22.349913-48.662261 0-67.806609 22.349913-22.617043 48.083478-22.617043 70.433391 0 125.417739 114.777043 125.417739 300.877913 0 417.435826-18.877217 17.363478-22.349913 20.880696-37.798956 20.880696z" p-id="24303" fill="#ffffff"></path></svg>
);

export default ({ fontSize, ...restProps }) => <Icon {...restProps} component={() => <SmallVolumnSvg size={fontSize} />} />;