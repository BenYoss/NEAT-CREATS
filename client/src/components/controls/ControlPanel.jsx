import React from 'react';
import propTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { makeStyles, styled } from '@material-ui/core/styles';
/**
 * control helpers for when complex features are implemented.
 * @param {*} param0
 * @returns helper functions for control panel features
 */
// import helpers from './control-helpers';

const useStyles = makeStyles((theme) => ({
  btn: {
    fontSize: '1vw',
    // backgroundColor: 'blue',
  },
}));

export default function ControlPanel({
  setVV, visibleVision, creatures, maxPop, setMp,
}) {
  const classes = useStyles();
  let pop = maxPop;
  return (
    <>
      <div className="cp-background" />
      <div className="control-panel">
        <Button className={classes.btn} variant="contained" color="white" type="button" onClick={() => { setVV(!visibleVision); }}>{visibleVision ? 'Show Sight: Enabled' : 'Show Sight: Disabled'}</Button>
        <section className="cp-section">
          <Button className={classes.btn} variant="contained" color="primary" type="button" onClick={() => { setMp(pop += 1); }}>
            +
          </Button>
          <Button className={classes.btn} variant="contained" color="white" type="button">
            Creature Max Population:
            {maxPop}
          </Button>
          <Button className={classes.btn} variant="contained" color="primary" type="button" onClick={() => { setMp(pop -= 1); }}>
            -
          </Button>
        </section>
        <section>
          <Button className={classes.btn} variant="contained" color="white" type="button">
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
