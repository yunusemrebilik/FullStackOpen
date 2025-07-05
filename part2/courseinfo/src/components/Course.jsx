const Header = ({ text }) => <h2>{text}</h2>
const Part = ({ name, exercises }) => <p>{name} {exercises}</p>
const Total = ({ course }) => <strong>total of {course.parts.reduce((acc, cur) => acc + cur.exercises, 0)} exercises</strong>

export const Course = ({ course }) => {
  return (
    <>
      <Header text={course.name} />
      {course.parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)}
      <Total course={course} />
    </>
  )
}
