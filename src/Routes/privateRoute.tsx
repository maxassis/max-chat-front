import { Navigate } from 'react-router-dom'
import { useLocalStorage } from 'react-use';

type Props = {
    children: React.ReactNode
}

export default function PrivateRoute({children}: Props) {
    const [value] = useLocalStorage('max-token', '');
    const user = value

    return user ? <>{children}</> : <Navigate to="/login" />
}