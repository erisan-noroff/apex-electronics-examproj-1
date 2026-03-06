import { getAllProducts } from '../api/productApi.js';
import { ToastMessage } from '../components/toast-messages.js';

try {
    await getAllProducts();
} catch (error) {
    ToastMessage.apiDataLoadError();
}
