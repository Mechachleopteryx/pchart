import React, { Component } from 'react';
import moment from 'moment';
import {AxisTransformation} from './utils';

export default class PatientData extends Component {
    render() {
        let data = this.props.dataset.data;
        let keys = Object.keys(data);
        let minX = keys[0];
        let maxX = keys[keys.length-1];
        let lenX = this.props.size.width - this.props.margins.left - this.props.margins.right;

        let firstentry = data[keys[0]];
        let lastentry = data[keys[keys.length-1]];
        let pp = Object.keys(firstentry);
        let _min = firstentry[pp[0]];
        let _max = lastentry[pp[pp.length-1]];
        let step = this.props.step;
        let tolerance = .05;
        let minY = Math.floor(((1-tolerance) * _min)/step) * step;
        let maxY = Math.ceil(((1+tolerance) * _max)/step) * step;
        let lenY = this.props.size.height - this.props.margins.top - this.props.margins.bottom;

        let transformX = new AxisTransformation(lenX, minX, maxX);
        let transformY = new AxisTransformation(lenY, minY, maxY);

        let labels = [];
        let points = [];
        let lineStr = ''
        this.props.patient.measures.forEach((m,i) => {
            let pointdate = moment(m.date);
            let birthdate =  moment(this.props.patient.birthdate);
            let datediff = pointdate.diff(birthdate, this.props.dataset.getUnitX());
            let value = m[this.props.dataset.getType()];
            let percentile = this.props.dataset.getPercentileForValue(datediff, value);
            console.log('drawing point ', datediff, this.props.dataset.getUnitX(), value);

            let x = transformX.transform(datediff) + this.props.margins.left;
            let y = this.props.size.height - this.props.margins.bottom - transformY.transform(value);

            if (this.props.showlabels)
                labels.push(
                    <text key={'label-'+i} name={'label-'+i} className='percentile-label' x={x} y={y-10} textAnchor='middle' fill={this.props.color || 'red'}>{percentile}</text>
                );

                points.push(
                <circle className='percentile-point' key={'dot-'+i} cx={x} cy={y} r={3} fill={this.props.color || 'red'} />
            )

            lineStr += (i===0 ? 'M' : 'L') + x + ' ' + y + ' '; 
        });
        console.log(lineStr);
        return (
            <g name='patient-data' className='patient-data'>
                <path className='percentile-line' d={lineStr} stroke={this.props.color || 'red'}/>
                {labels}
                {points}
            </g>
        )
    }
}

