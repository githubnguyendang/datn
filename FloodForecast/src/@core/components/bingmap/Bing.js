import { createLayerComponent } from '@react-leaflet/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { bingLayer } from './leaflet.bing';

const createLeafletElement = (props) => {
    const instance = L.bingLayer(props.bingkey, props);

    return { instance };
  }

export default createLayerComponent(createLeafletElement);
