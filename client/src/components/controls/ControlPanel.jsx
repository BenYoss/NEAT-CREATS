import React from 'react';
import propTypes from 'prop-types';
import { Button } from '@material-ui/core';
/**
 * control helpers for when complex features are implemented.
 * @param {*} param0
 * @returns helper functions for control panel features
 */
// import helpers from './control-helpers';

export default function ControlPanel({
  setVV, visibleVision, creatures, maxPop, setMp,
}) {
  let pop = maxPop;
  return (
    <>
      <div className="cp-background" />
      <div className="control-panel">
        <Button variant="contained" color="white" type="button" onClick={() => { setVV(!visibleVision); }}>{visibleVision ? 'Show Sight: Enabled' : 'Show Sight: Disabled'}</Button>
        <section className="cp-section">
          <Button variant="contained" color="primary" type="button" className="pop-button" onClick={() => { setMp(pop += 1); }}>
            +
          </Button>
          <Button variant="contained" color="white" type="button" className="pop">
            Creature Max Population:
            {maxPop}
          </Button>
          <Button variant="contained" color="primary" type="button" className="pop-button" onClick={() => { setMp(pop -= 1); }}>
            -
          </Button>
        </section>
        <section>
          <Button variant="contained" color="white" type="button" className="population">
            Creature Population:
            {creatures.length}
          </Button>
        </section>
      </div>
    </>
  );
}

// propTypes for ControlPanel component.
ControlPanel.propTypes = {
  setVV: propTypes.bool.isRequired,
  visibleVision: propTypes.bool.isRequired,
  creatures: propTypes.shape([{}]).isRequired,
  maxPop: propTypes.number.isRequired,
  setMp: propTypes.number.isRequired,
};
