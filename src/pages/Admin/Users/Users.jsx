import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './Users.module.scss';
import { useTranslation } from 'react-i18next';
import useUser from '../../../hooks/useUser';
import { Button, Table } from 'react-bootstrap';
import useOpenToggle from '../../../hooks/useOpenToggle';
import ActionModal from '../../../components/ActionModal';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import Modal from '../../../components/Modal';
import { EditUser, NewUser } from '../../../forms';

const propTypes = {
	className: PropTypes.string,
	testId: PropTypes.string,
	id: PropTypes.string,
};

const defaultProps = {
	className: '',
	testId: undefined,
	id: undefined,
};

const texts = {
	Title: 'Users.Title',
	DeleteHeader: 'DeleteHeader',
	DeleteMessage: 'DeleteMessage',
	EditUser: 'EditUser.Title',
	NewUser: 'NewUser.Title',
};

const Users = ({ className, testId, id }) => {
	const usersClassNames = classnames(styles.Users, className);
	const { t } = useTranslation();
	const { users, isLoading } = useUser();
	const [dataTable, setDataTable] = useState([]);

	const [user, setUser] = useState(undefined);

	useEffect(() => {
		const aa = async () => {
			const usersOut = await users();
			setDataTable(usersOut);
		};
		aa();
	}, []);

	const {
		isOpen: isOpenConfirmDeleteUser,
		open: openConfirmDeleteUser,
		close: closeConfirmDeleteUser,
	} = useOpenToggle(false);

	const {
		isOpen: isOpenEditUser,
		open: openEditUser,
		close: closeEditUser,
	} = useOpenToggle(false);

	const {
		isOpen: isOpenNewUser,
		open: openNewUser,
		close: closeNewUser,
	} = useOpenToggle(false);

	const handleEditeUser = user => {
		setUser(user);
		openEditUser();
	};

	return (
		<div className={usersClassNames} data-testid={testId} id={id}>
			{t(texts.Title)}
			<Button onClick={openNewUser}>New User</Button>
			<Table striped bordered hover responsive>
				<thead>
					<tr>
						<th>#</th>
						<th>Username</th>
						<th>Name</th>
						<th>Type</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<tr>
							<td colSpan='5' className='text-center'>
								Cargando...
							</td>
						</tr>
					) : (
						dataTable.map((user, index) => (
							<tr key={index}>
								<td>{index}</td>
								<td>{user.username}</td>
								<td>{user.name}</td>
								<td>{user.type}</td>
								<td className={styles.Actions}>
									<Button
										className={styles.ButtonActions}
										onClick={() => handleEditeUser(user)}
									>
										<MdEdit />
									</Button>
									<Button
										className={styles.ButtonActions}
										onClick={openConfirmDeleteUser}
									>
										<MdDeleteForever />
									</Button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</Table>

			<ActionModal
				id={id}
				isOpen={isOpenConfirmDeleteUser}
				onHide={closeConfirmDeleteUser}
				onClose={closeConfirmDeleteUser}
				onReject={closeConfirmDeleteUser}
				onAccept={closeConfirmDeleteUser}
				header={t(texts.DeleteHeader)}
			>
				<span>{t(texts.DeleteMessage)}</span>
			</ActionModal>

			<Modal
				id={id}
				size='xs'
				isOpen={isOpenEditUser}
				onHide={closeEditUser}
				onClose={closeEditUser}
				header={t(texts.EditUser)}
			>
				<EditUser data={user} onClose={closeEditUser} />
			</Modal>

			<Modal
				id={id}
				size='xs'
				isOpen={isOpenNewUser}
				onHide={closeNewUser}
				onClose={closeNewUser}
				header={t(texts.NewUser)}
			>
				<NewUser data={user} onClose={closeNewUser} />
			</Modal>
		</div>
	);
};

Users.propTypes = propTypes;
Users.defaultProps = defaultProps;

export default Users;
