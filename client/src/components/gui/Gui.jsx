/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { Chart } from 'chart.js';
import ControlPanel from '../controls/ControlPanel';
import chartData from './chartdata.json';

let counter = 0;
export default function Gui({
  setVV, visibleVision, creatures, maxPop, setMp,
}) {
  /**
   * @func chartIt:
   * chartIt renders data collected from the 3D environment and renders it on a chart.
   * @param {*} c
   * c are the creatures that exist in environment.
   */

  function chartIt(c) {
    const ctx = document.getElementById('chart').getContext('2d');
    const ctxd = document.getElementById('doughnut-chart').getContext('2d');
    const names = [];
    const lifespans = [];
    let carns = 0;
    let herbs = 0;
    if (c.length) {
      for (let i = 0; i < 10; i += 1) {
        names.push(c[i] ? c[i].name : 'None');
        lifespans.push(c[i] ? c[i].size : 'None');
      }
      c.forEach((creat) => {
        if (creat.isCarn) {
          carns += 1;
        } else {
          herbs += 1;
        }
      });
      lifespans.sort((a, b) => b - a);
    }
    // Chart that displays top 10 creature sizes.
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [...names || 'Empty'],
        datasets: [{
          label: 'Creature Sizes',
          data: [...lifespans || 'Empty'],
          backgroundColor: chartData[0].backgroundColor,
          borderColor: chartData[0].borderColor,
          borderWidth: 1,
        }],
      },
    });

    // Chart that displays average comparison between carnivores/herbivores in environment.
    const dchart = new Chart(ctxd, {
      type: 'doughnut',
      data: {
        labels: [
          'Carnivore',
          'Herbivore',
        ],
        datasets: [{
          label: 'Carnviore/Herbivore Comparison',
          data: [carns, herbs],
          backgroundColor: chartData[1].backgroundColor,
          hoverOffset: 4,
        }],
      },
    });
  }

  useEffect(() => {
    counter += 10;
    if (counter === 1000) {
      chartIt(creatures);
      counter = 0;
    }
  }, [creatures, counter]);

  return (
    <div>
      <ControlPanel
        setVV={setVV}
        visibleVision={visibleVision}
        maxPop={maxPop}
        setMp={setMp}
        creatures={creatures}
      />
      <div className="chart-container">
        <canvas id="chart" />
      </div>
      <div className="dchart-container">
        <canvas id="doughnut-chart" width="100" height="100" />
      </div>
      <h1>NEAT - CREATS</h1>
    </div>
  );
}
// propTypes for GUI component.
Gui.propTypes = {
  setVV: propTypes.bool.isRequired,
  visibleVision: propTypes.bool.isRequired,
  creatures: propTypes.shape([{}]).isRequired,
  maxPop: propTypes.number.isRequired,
  setMp: propTypes.number.isRequired,
};
