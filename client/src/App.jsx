import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = '/api/students';  // Sử dụng proxy

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    mssv: '',
    name: '',
    email: ''
  });

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách:', error);
      alert('Không thể tải danh sách sinh viên. Kiểm tra backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý thêm sinh viên
  const handleSubmit = async () => {
    if (!formData.mssv || !formData.name || !formData.email) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const response = await axios.post(API_URL, formData);
      console.log('Thêm thành công:', response.data);
      alert('✅ Thêm sinh viên thành công!');
      fetchStudents();         // cập nhật danh sách
      setFormData({ mssv: '', name: '', email: '' }); // reset form
    } catch (error) {
      console.error('Lỗi khi thêm:', error);
      // Hiển thị chi tiết lỗi từ backend (nếu có)
      const msg = error.response?.data?.error || error.message;
      alert(`❌ Thêm thất bại: ${msg}`);
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  return (
    <div className="app-container">
      <h1> Quản lý sinh viên</h1>

      <div className="form-section">
        <h2>Thêm sinh viên mới</h2>
        <div className="form-group">
          <input
            type="text"
            name="mssv"
            placeholder="MSSV"
            value={formData.mssv}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <button onClick={handleSubmit}>Thêm sinh viên</button>
        </div>
      </div>

      <div className="list-section">
        <h2>Danh sách sinh viên</h2>
        {students.length === 0 ? (
          <p>Chưa có sinh viên nào.</p>
        ) : (
          <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>MSSV</th>
                <th>Họ tên</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((sv) => (
                <tr key={sv._id}>
                  <td>{sv.mssv}</td>
                  <td>{sv.name}</td>
                  <td>{sv.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;