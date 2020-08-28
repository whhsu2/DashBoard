import React from 'react'
import {
    Link
  } from "react-router-dom";

class SegmentCard extends React.Component { 
    render() {
        return (
            <div >
                <Link to='/segment'>
                    <button className="segment-card-text">Segment Id: {this.props.id}, Open Rate: 10%</button>
                </Link>
            </div>
        )
    }
}

export default SegmentCard;