import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = '/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    mssv: '',
    name: '',
    email: ''
  });

  // State cho cập nhật
  const [editData, setEditData] = useState({
    id: '',
    mssv: '',
    name: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);

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

  // Xử lý thay đổi input thêm mới
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
      alert('Thêm sinh viên thành công!');
      fetchStudents();
      setFormData({ mssv: '', name: '', email: '' });
    } catch (error) {
      console.error('Lỗi khi thêm:', error);
      const msg = error.response?.data?.error || error.message;
      alert(` Thêm thất bại: ${msg}`);
    }
  };

  // Xử lý mở form cập nhật
  const startEdit = (student) => {
    setEditData({
      id: student._id,
      mssv: student.mssv,
      name: student.name,
      email: student.email
    });
    setIsEditing(true);
  };

  // Xử lý cập nhật sinh viên
  const handleUpdate = async () => {
    if (!editData.mssv || !editData.name || !editData.email) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${editData.id}`, {
        mssv: editData.mssv,
        name: editData.name,
        email: editData.email
      });
      console.log('Cập nhật thành công:', response.data);
      alert(' Cập nhật sinh viên thành công!');
      setIsEditing(false);
      setEditData({ id: '', mssv: '', name: '', email: '' });
      fetchStudents();
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      const msg = error.response?.data?.error || error.message;
      alert(`❌ Cập nhật thất bại: ${msg}`);
    }
  };

  // Xử lý xóa sinh viên (chuẩn bị cho câu 62)
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert(' Xóa thành công!');
      fetchStudents();
    } catch (error) {
      console.error('Lỗi xóa:', error);
      alert(' Xóa thất bại!');
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  return (
    <div className="app-container">
      <h1>Quản lý sinh viên</h1>

      {/* FORM THÊM SINH VIÊN */}
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

      {/* FORM CẬP NHẬT (hiển thị có điều kiện) */}
      {isEditing && (
        <div className="edit-section">
          <h3> Chỉnh sửa sinh viên</h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="MSSV"
              value={editData.mssv}
              onChange={(e) => setEditData({ ...editData, mssv: e.target.value })}
            />
            <input
              type="text"
              placeholder="Họ tên"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
            <button onClick={handleUpdate}>Cập nhật</button>
            <button onClick={() => setIsEditing(false)}>Hủy</button>
          </div>
        </div>
      )}

      {/* DANH SÁCH SINH VIÊN */}
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
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {students.map((sv) => (
                <tr key={sv._id}>
                  <td>{sv.mssv}</td>
                  <td>{sv.name}</td>
                  <td>{sv.email}</td>
                  <td>
                    <button onClick={() => startEdit(sv)}>✏️ Sửa</button>
                    <button onClick={() => handleDelete(sv._id)}>🗑️ Xóa</button>
                  </td>
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