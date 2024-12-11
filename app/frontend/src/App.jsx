import React, { useEffect, useState } from "react";
import api from './api';
import './App.css';

const App = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    study_year: '',
    group: '',
    faculty: ''
  });

  const fetchStudents = async () => {
    try {
      const response = await api.get('/', {
        params: { page: currentPage, size: pageSize }
      });
      const { students, totalPages } = response.data;
      setStudents(students);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, pageSize]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentInfo = {
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      study_year: parseInt(formData.study_year),
      group: formData.group,
      faculty: formData.faculty
    };

    const isDelete = e.nativeEvent.submitter.classList.contains('btn-danger');

    try {
      if (isDelete) {
        await api.delete('/delete/', { data: studentInfo });
      } else {
        await api.post('/create/', studentInfo);
      }
      fetchStudents();
      setFormData({
        last_name: '',
        first_name: '',
        middle_name: '',
        study_year: '',
        group: '',
        faculty: ''
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Students Admin's Panel</a>
        </div>
      </nav>

      <div className="container">
        <form onSubmit={handleSubmit}>
          <h3>Добавить или удалить запись</h3>
          <input type="text" name="last_name" placeholder="Фамилия" onChange={handleInputChange} value={formData.last_name} />
          <input type="text" name="first_name" placeholder="Имя" onChange={handleInputChange} value={formData.first_name} />
          <input type="text" name="middle_name" placeholder="Отчество" onChange={handleInputChange} value={formData.middle_name} />
          <input type="text" name="study_year" placeholder="Год обучения" onChange={handleInputChange} value={formData.study_year} />
          <input type="text" name="group" placeholder="Группа" onChange={handleInputChange} value={formData.group} />
          <input type="text" name="faculty" placeholder="Факультет" onChange={handleInputChange} value={formData.faculty} />

          <div>
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="submit" className="btn btn-danger">Delete</button>
          </div>
        </form>

        <div>
          <label>Page Size:</label>
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Фамилия</th>
              <th>Имя</th>
              <th>Отчество</th>
              <th>Год обучения</th>
              <th>Группа</th>
              <th>Факультет</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={`${student.last_name}-${student.first_name}`}>
                <td>{student.first_name}</td>
                <td>{student.middle_name}</td>
                <td>{student.last_name}</td>
                <td>{student.study_year}</td>
                <td>{student.group}</td>
                <td>{student.faculty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
          <span>{currentPage} of {totalPages}</span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>

        <div>
          <input
            type="number"
            value={currentPage}
            onChange={(e) => goToPage(Math.max(1, Math.min(totalPages, e.target.value)))}
            min={1}
            max={totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
