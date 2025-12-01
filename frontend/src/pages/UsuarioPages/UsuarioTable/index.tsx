import { Button } from "../../../components/Button";
import type { IUsuario } from "../../../models/usuario.model";


interface UsuarioTableProps {
    usuarios: IUsuario[];
    onEdit: (usuario: IUsuario) => void;
    onDelete: (usuarioId: string) => void;
    usuarioEmEdicao: IUsuario | null; // Nova prop
}

export const UsuarioTable = (
    { usuarios, onEdit, onDelete, usuarioEmEdicao }: UsuarioTableProps) => {

    return (
        <>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NOME</th>
                        <th>E-MAIL</th>
                        <th>STATUS</th>
                        <th>AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => {
                        const desabilitado = !!usuarioEmEdicao;
                        return (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.nome}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.status}</td>
                                <td className="d-flex gap-2">
                                    <Button
                                        variant="warning"
                                        value="Editar"
                                        onClick={() => onEdit(usuario)}
                                        disabled={desabilitado}
                                    />
                                    <Button
                                        value="Excluir"
                                        variant="danger"
                                        onClick={() => onDelete(usuario.id || '')}
                                        disabled={desabilitado}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}