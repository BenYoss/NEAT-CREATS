/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import { Chart } from 'chart.js';

export default function Gui({
  setVV, visibleVision, creatures, plantAmount, creatSight, maxPop, population, setMp,
}) {
  function chartIt(c) {
    const ctx = document.getElementById('chart').getContext('2d');
    const ctxd = document.getElementById('doughnut-chart').getContext('2d');
    const names = [];
    const lifespans = [];
    let carns = 0;
    let herbs = 0;
    if (c.length) {
      for (let i = 0; i < 10; i += 1) {
        names.push(c[i].name);
        lifespans.push(c[i].size);
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
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [...names],
        datasets: [{
          label: 'Creature Sizes',
          data: [...lifespans],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
          ],
          borderWidth: 1,
        }],
      },
    });

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
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          hoverOffset: 4,
        }],
      },
    });
  }
  // const lifeSpanChart = new Chart(ctx);
  useEffect(() => {
    if (document.getElementById('chart')) {
      chartIt(creatures);
    }
  }, [chartIt, creatures]);
  return (
    <div>
      <button type="button" onClick={() => { setVV(!visibleVision); }}>{visibleVision ? 'Show Sight: Enabled' : 'Show Sight: Disabled'}</button>
      <section>
        <button type="button" className="pop-button-pos" onClick={() => { setMp(maxPop += 1); }}>
          +
        </button>
        <button type="button" className="pop">
          Creature Max Population:
          {maxPop}
        </button>
        <button type="button" className="pop-button-neg" onClick={() => { setMp(maxPop -= 1); }}>
          -
        </button>
      </section>
      <section>
        <button type="button" className="population">
          Creature Population:
          {creatures.length}
        </button>
      </section>
      <div className="chart-container">
        <canvas id="chart" width="400" height="400" />
      </div>
      <div className="dchart-container">
        <canvas id="doughnut-chart" width="100" height="100" />
      </div>
      <h1>NEAT - CREATS</h1>
    </div>
  );
}
