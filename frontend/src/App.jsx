import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Iconos SVG como componentes
const AlertCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const X = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Edit2 = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const Trash2 = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const Plus = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Loader2 = ({ className }) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Sistema de notificaciones toast
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-slide-in`}>
      <Icon className="w-5 h-5" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white hover:bg-opacity-20 rounded p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Modal para confirmación de eliminación
const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-mx">
        <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
        <p className="text-gray-600 mb-6">¿Está seguro de que desea eliminar este mensaje?</p>
        <p className="text-sm text-gray-800 bg-gray-100 p-2 rounded mb-4 italic">"{message}"</p>
        <div className="flex space-x-3 justify-end">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal para edición de mensajes
const EditModal = ({ isOpen, onSave, onCancel, currentMessage }) => {
  const [editContent, setEditContent] = useState(currentMessage || '');
  const [isValidContent, setIsValidContent] = useState(true);

  useEffect(() => {
    setEditContent(currentMessage || '');
    setIsValidContent(true);
  }, [currentMessage, isOpen]);

  const handleSave = () => {
    const trimmedContent = editContent.trim();
    if (trimmedContent.length < 3) {
      setIsValidContent(false);
      return;
    }
    if (trimmedContent.length > 500) {
      setIsValidContent(false);
      return;
    }
    onSave(trimmedContent);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-mx">
        <h3 className="text-lg font-semibold mb-4">Editar mensaje</h3>
        <textarea
          value={editContent}
          onChange={(e) => {
            setEditContent(e.target.value);
            setIsValidContent(true);
          }}
          onKeyPress={handleKeyPress}
          placeholder="Ingrese el contenido del mensaje..."
          className={`w-full p-3 border rounded-lg resize-none h-32 focus:outline-none focus:ring-2 ${
            isValidContent 
              ? 'border-gray-300 focus:ring-blue-500' 
              : 'border-red-300 focus:ring-red-500'
          }`}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-2 mb-4">
          <span className={`text-sm ${editContent.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
            {editContent.length}/500
          </span>
          {!isValidContent && (
            <span className="text-sm text-red-500">
              El mensaje debe tener entre 3 y 500 caracteres
            </span>
          )}
        </div>
        <div className="flex space-x-3 justify-end">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!editContent.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Guardar
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Tip: Usa Ctrl+Enter para guardar rápidamente</p>
      </div>
    </div>
  );
};

// Componente de carga
const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClass = size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-8 h-8' : 'w-6 h-6';
  return <Loader2 className={`${sizeClass} animate-spin`} />;
};

// Hook personalizado para debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Componente principal mejorado
const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [loading, setLoading] = useState({
    fetch: false,
    create: false,
    update: false,
    delete: false
  });
  const [toast, setToast] = useState(null);
  const [modals, setModals] = useState({
    confirm: { isOpen: false, messageToDelete: null },
    edit: { isOpen: false, messageToEdit: null }
  });
  const [inputError, setInputError] = useState('');
  
  const apiUrl = 'http://localhost:8080/api/messages';
  const debouncedInput = useDebounce(newMessageContent, 300);

  // Validación en tiempo real del input
  useEffect(() => {
    if (debouncedInput.trim().length > 0 && debouncedInput.trim().length < 3) {
      setInputError('El mensaje debe tener al menos 3 caracteres');
    } else if (debouncedInput.length > 500) {
      setInputError('El mensaje no puede exceder 500 caracteres');
    } else {
      setInputError('');
    }
  }, [debouncedInput]);

  // Función para mostrar notificaciones
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  // Gestión de loading states
  const setLoadingState = useCallback((operation, isLoading) => {
    setLoading(prev => ({ ...prev, [operation]: isLoading }));
  }, []);

  // useEffect para cargar los mensajes al iniciar el componente
  useEffect(() => {
    readAllMessages();
  }, []);

  // Función optimizada para leer todos los mensajes
  const readAllMessages = useCallback(async () => {
    setLoadingState('fetch', true);
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
      showToast('Mensajes cargados correctamente', 'success');
    } catch (error) {
      console.error('Error al leer los mensajes:', error);
      showToast('Error al cargar los mensajes. Verifique la conectividad.', 'error');
      setMessages([]);
    } finally {
      setLoadingState('fetch', false);
    }
  }, [apiUrl, showToast, setLoadingState]);

  // Función para crear un nuevo mensaje con validaciones mejoradas
  const createMessage = useCallback(async () => {
    const trimmedContent = newMessageContent.trim();
    
    if (!trimmedContent) {
      setInputError('El mensaje no puede estar vacío');
      return;
    }
    if (trimmedContent.length < 3) {
      setInputError('El mensaje debe tener al menos 3 caracteres');
      return;
    }
    if (trimmedContent.length > 500) {
      setInputError('El mensaje no puede exceder 500 caracteres');
      return;
    }

    setLoadingState('create', true);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmedContent }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Optimización: agregar mensaje localmente en lugar de recargar todo
      const newMessage = { id: Date.now(), message: trimmedContent };
      setMessages(prev => [...prev, newMessage]);
      
      setNewMessageContent('');
      setInputError('');
      showToast('Mensaje creado exitosamente', 'success');
    } catch (error) {
      console.error('Error al crear el mensaje:', error);
      showToast('Error al crear el mensaje. Intente nuevamente.', 'error');
    } finally {
      setLoadingState('create', false);
    }
  }, [newMessageContent, apiUrl, showToast, setLoadingState]);

  // Función para actualizar un mensaje
  const updateMessage = useCallback(async (id, newContent) => {
    setLoadingState('update', true);
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newContent }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Optimización: actualizar mensaje localmente
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, message: newContent } : msg
      ));
      
      showToast('Mensaje actualizado correctamente', 'success');
      setModals(prev => ({ ...prev, edit: { isOpen: false, messageToEdit: null } }));
    } catch (error) {
      console.error('Error al actualizar el mensaje:', error);
      showToast('Error al actualizar el mensaje. Intente nuevamente.', 'error');
    } finally {
      setLoadingState('update', false);
    }
  }, [apiUrl, showToast, setLoadingState]);

  // Función para eliminar un mensaje
  const deleteMessage = useCallback(async (id) => {
    setLoadingState('delete', true);
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Optimización: eliminar mensaje localmente
      setMessages(prev => prev.filter(msg => msg.id !== id));
      
      showToast('Mensaje eliminado correctamente', 'success');
      setModals(prev => ({ ...prev, confirm: { isOpen: false, messageToDelete: null } }));
    } catch (error) {
      console.error('Error al borrar el mensaje:', error);
      showToast('Error al eliminar el mensaje. Intente nuevamente.', 'error');
    } finally {
      setLoadingState('delete', false);
    }
  }, [apiUrl, showToast, setLoadingState]);

  // Handlers para modales
  const handleEditClick = useCallback((message) => {
    setModals(prev => ({ 
      ...prev, 
      edit: { isOpen: true, messageToEdit: message } 
    }));
  }, []);

  const handleDeleteClick = useCallback((message) => {
    setModals(prev => ({ 
      ...prev, 
      confirm: { isOpen: true, messageToDelete: message } 
    }));
  }, []);

  // Manejo de teclas para crear mensaje
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      createMessage();
    }
  }, [createMessage]);

  // Memoización de la lista de mensajes para optimizar renders
  const messagesList = useMemo(() => {
    return messages.map((message) => (
      <div 
        key={message.id}
        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex-grow min-w-0">
            <p className="text-lg font-medium text-gray-800 break-words leading-relaxed">
              {message.message}
            </p>
            <span className="text-sm text-gray-500 font-mono">
              ID: {message.id}
            </span>
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <button 
              onClick={() => handleEditClick(message)}
              disabled={loading.update}
              className="flex items-center space-x-1 bg-emerald-500 text-white px-3 py-2 rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading.update ? <LoadingSpinner size="small" /> : <Edit2 className="w-4 h-4" />}
              <span className="hidden sm:inline">Editar</span>
            </button>
            <button 
              onClick={() => handleDeleteClick(message)}
              disabled={loading.delete}
              className="flex items-center space-x-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading.delete ? <LoadingSpinner size="small" /> : <Trash2 className="w-4 h-4" />}
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    ));
  }, [messages, loading.update, loading.delete, handleEditClick, handleDeleteClick]);

  const isCreateDisabled = !newMessageContent.trim() || !!inputError || loading.create;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <h1 className="text-3xl font-bold text-center">
              Sistema de Gestión de Mensajes
            </h1>
            <p className="text-center text-blue-100 mt-2">
              Plataforma empresarial para administración de contenido
            </p>
          </div>
          
          <div className="p-6">
            {/* Formulario para crear un nuevo mensaje */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crear nuevo mensaje
              </label>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="flex-grow">
                  <textarea
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ingrese el contenido del mensaje..."
                    className={`w-full p-3 border rounded-lg resize-none h-20 focus:outline-none focus:ring-2 transition-colors ${
                      inputError 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-sm ${newMessageContent.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                      {newMessageContent.length}/500
                    </span>
                    {inputError && (
                      <span className="text-sm text-red-500">{inputError}</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={createMessage}
                  disabled={isCreateDisabled}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 h-fit"
                >
                  {loading.create ? (
                    <LoadingSpinner />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  <span>Crear Mensaje</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tip: Usa Ctrl+Enter para crear rápidamente
              </p>
            </div>

            {/* Lista de mensajes */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Mensajes ({messages.length})
                </h2>
                <button
                  onClick={readAllMessages}
                  disabled={loading.fetch}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {loading.fetch ? <LoadingSpinner size="small" /> : null}
                  <span>Actualizar</span>
                </button>
              </div>
              
              {loading.fetch ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <LoadingSpinner size="large" />
                    <p className="text-gray-500 mt-2">Cargando mensajes...</p>
                  </div>
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messagesList}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">No hay mensajes disponibles</p>
                  <p className="text-gray-400 text-sm mt-1">Cree el primer mensaje para comenzar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ConfirmModal 
        isOpen={modals.confirm.isOpen}
        onConfirm={() => deleteMessage(modals.confirm.messageToDelete.id)}
        onCancel={() => setModals(prev => ({ ...prev, confirm: { isOpen: false, messageToDelete: null } }))}
        message={modals.confirm.messageToDelete?.message || ''}
      />
      
      <EditModal 
        isOpen={modals.edit.isOpen}
        onSave={(newContent) => updateMessage(modals.edit.messageToEdit.id, newContent)}
        onCancel={() => setModals(prev => ({ ...prev, edit: { isOpen: false, messageToEdit: null } }))}
        currentMessage={modals.edit.messageToEdit?.message || ''}
      />

      {/* Sistema de notificaciones */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;