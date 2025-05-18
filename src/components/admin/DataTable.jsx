import React, { useState } from 'react';
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import '../../styles/admin/DataTable.css';

const DataTable = ({ 
  data, 
  columns, 
  title,
  onView,
  onEdit, 
  onDelete,
  loading,
  error,
  pagination,
  onPageChange,
  emptyMessage = 'No hay datos disponibles'
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Función para ordenar los datos
  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Función para cambiar el orden
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Función para renderizar el icono de ordenación
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="sort-icon" />;
    }
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="sort-icon active" /> 
      : <FaSortDown className="sort-icon active" />;
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (onPageChange) {
        onPageChange(newPage);
      }
    }
  };

  // Función para cambiar el número de elementos por página
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Renderizar la tabla
  return (
    <div className="data-table-container">
      {title && <h2 className="table-title">{title}</h2>}
      
      {error && <div className="table-error">{error}</div>}
      
      {loading ? (
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <p>Cargando datos...</p>
        </div>
      ) : (
        <>
          {sortedData.length === 0 ? (
            <div className="table-empty">{emptyMessage}</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      {columns.map(column => (
                        <th 
                          key={column.key} 
                          onClick={() => column.sortable !== false && requestSort(column.key)}
                          className={column.sortable !== false ? 'sortable' : ''}
                        >
                          {column.label}
                          {column.sortable !== false && getSortIcon(column.key)}
                        </th>
                      ))}
                      {(onView || onEdit || onDelete) && (
                        <th className="actions-column">Acciones</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr key={item.id || index}>
                        {columns.map(column => (
                          <td key={`${item.id || index}-${column.key}`}>
                            {column.render 
                              ? column.render(item[column.key], item) 
                              : item[column.key]}
                          </td>
                        ))}
                        {(onView || onEdit || onDelete) && (
                          <td className="actions-cell">
                            {onView && (
                              <button 
                                className="view-button"
                                onClick={() => onView(item)}
                                title="Ver detalles"
                              >
                                <FaEye />
                              </button>
                            )}
                            {onEdit && (
                              <button 
                                className="edit-button"
                                onClick={() => onEdit(item)}
                                title="Editar"
                              >
                                <FaEdit />
                              </button>
                            )}
                            {onDelete && (
                              <button 
                                className="delete-button"
                                onClick={() => onDelete(item)}
                                title="Eliminar"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="table-pagination">
                <div className="pagination-info">
                  Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, sortedData.length)} de {sortedData.length} registros
                </div>
                <div className="pagination-controls">
                  <select 
                    value={itemsPerPage} 
                    onChange={handleItemsPerPageChange}
                    className="items-per-page"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <button 
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    &laquo;
                  </button>
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    &lsaquo;
                  </button>
                  <span className="pagination-current">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    &rsaquo;
                  </button>
                  <button 
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DataTable;
