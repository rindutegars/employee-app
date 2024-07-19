import PropTypes from 'prop-types';
import { useEffect } from 'react';

const Snackbar = ({ message, type, onClose }) => {
    const backgroundColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Snackbar will disappear after 3 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 text-white ${backgroundColor} rounded shadow-lg`}>
            <span>{message}</span>
        </div>
    );
};

Snackbar.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error']).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Snackbar;
