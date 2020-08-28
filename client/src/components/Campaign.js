import React from 'react';
import Header from './Header'
import TimeLine from './Timeline'
import SegmentSlide from './Segment_Slide'


function Campaign() {
  return (
    <div className="App">
      <Header />
      <div className="grid-container">
        <TimeLine/>
        <SegmentSlide />
      </div>
    </div>
  );
}

export default Campaign;
