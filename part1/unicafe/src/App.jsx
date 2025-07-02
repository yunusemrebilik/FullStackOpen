import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Statistics = ({ good, neutral, bad, total, avg, percentageOfPositive}) => {
  return (
    <>
      <h1>statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {total}</p>
      <p>average {avg}</p>
      <p>positive {percentageOfPositive} %</p>
    </>
  )  
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const calcTotal = () => good + neutral + bad
  const calcAvg = () => (good - bad) / calcTotal()
  const calcPercentageOfPositive = () => good / calcTotal() * 100

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />

      <Statistics good={good} neutral={neutral} bad={bad} total={calcTotal()} 
        avg={calcAvg() || 0} percentageOfPositive={calcPercentageOfPositive() || 0} />
    </div>
  )
}

export default App