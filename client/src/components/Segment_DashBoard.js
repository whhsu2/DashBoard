import React from 'react'
import SegmentDistribution from './SegmentDistribution'
import BarChart from './BarChart'
import PercentagePlot from './PercentagesPlot'

class Segment extends React.Component { 
    render() {
        return (
            <div>
                <div className="segment-title">Segment: {this.props.match.params.id}</div>
                <div className="segment-dashboard">
                    <div className="segment-container-1">
                        <PercentagePlot />
                    </div>
                    <div className="segment-container-2">
                        <SegmentDistribution />
                        <BarChart />
                    </div>

                </div>

            </div>
        )
    }
}

export default Segment;