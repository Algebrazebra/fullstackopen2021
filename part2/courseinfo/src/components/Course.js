import React from 'react';

const Header = ({ course }) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Total = ({ course }) => {
  const allExercises = course.parts.map(p => p.exercises)
  const sumExercises = allExercises.reduce((l, r) => l + r, 0)
  return(
    <p>total of {sumExercises} exercises</p>
  ) 
}

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>    
  )
}

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map(p => 
        <Part key={p.id} part={p} />
      )}
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
    <Header course={course} />
    <Content course={course} />
    <Total course={course} />
    </div>
  )
}

export default Course