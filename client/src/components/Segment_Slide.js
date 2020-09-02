import React from 'react'
import SegmentCard from './SegmentCard'

class SegmentSlide extends React.Component { 
    constructor(props) {
        super(props)
        this.getListofSegments = this.getListofSegments.bind(this)
    }


    getListofSegments (list_of_segments) {
        return list_of_segments.map(segment_id => {
            return <SegmentCard id={segment_id} />
        })
    }

    render() {
        const tmp_list_of_segments = [1,2,3,4]
        return (
            <div className="segment-slide">
                <div className="segment-slide-title">Segment Open Rates</div>
                <hr className="solid"></hr>
                {this.getListofSegments(tmp_list_of_segments)}
            </div>
        )
    }
}

export default SegmentSlide;