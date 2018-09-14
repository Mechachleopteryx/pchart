import React, { Component } from 'react';
import Store from './store';
let short_tick_len = 5;
let long_tick_len = 10;

class XAxis extends Component {
    render() {
        let data = Store.getDataset().data;
        let keys = Object.keys(data);
        let count = keys.length;
        let len = Store.getSize().width - Store.getMargins().left - Store.getMargins().right;
        let stepX = len/(count-1);
        let step = Store.getDataset().getUnitX()==='month' ? 6 : (Store.getDataset().getUnitX()==='week' ? 1 : 5);
        let labelstep = Store.getDataset().getUnitX()==='month' ? 2 : 1;
        let ticks = [];
        let valuelabels = [];
        for(let t = 0; t<count; t++) {
            let long = t%step===0;
            let x = Store.getMargins().left + t * stepX;
            let y1 = Store.getSize().height-Store.getMargins().bottom;
            let y2 = y1 + (long ? long_tick_len : short_tick_len);
            ticks.push(
                <line className={long?'longtick':'tick'} key={'tick-'+t} x1={x} y1={y1} x2={x} y2={y2}/>
            );
            let showlabel = t%(step*labelstep)===0
            if (showlabel) {
                valuelabels.push(
                    <text key={'valuelabel-'+t} name='valuelabel' x={x} y={y2+2+10} textAnchor='middle'>
                        {keys[t]}
                    </text>
                );
            }
        } 
        let axisTitle = Store.getDataset().getUnitX()==='month' ? 'Mesi' : Store.getDataset().getUnitX()==='week' ? 'Settimane' : ''
        return (
            <g name='xaxis' className='axis'>
                <line x1={Store.getMargins().left} y1={Store.getSize().height-Store.getMargins().bottom} 
                    x2={Store.getSize().width-Store.getMargins().right} y2={Store.getSize().height-Store.getMargins().bottom}/>
                <g>
                    {ticks}
                </g>
                <g>
                    {valuelabels}
                </g>
                <text name='axislabel' x={(Store.getMargins().left+Store.getSize().width-Store.getMargins().right)/2} y={Store.getSize().height-5} textAnchor='middle'>
                    {axisTitle}
                </text>
            </g>
        );
    }
}

export default XAxis;
