import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://crud-users-fullstack.onrender.com";

const stripPhoneDigits = (value) =>
  String(value || "")
    .replace(/\D/g, "")
    .slice(0, 11);

const formatPhone = (value) => {
  const digits = stripPhoneDigits(value);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validateUserForm = ({ name, email, phone, password }) => {
  const phoneDigits = stripPhoneDigits(phone);

  if (!name.trim()) return "Nome e obrigatorio.";
  if (name.trim().length < 3) return "Nome deve ter pelo menos 3 caracteres.";
  if (!email.trim()) return "E-mail e obrigatorio.";
  if (!isValidEmail(email.trim())) return "Formato de e-mail invalido.";
  if (!phoneDigits) return "Telefone e obrigatorio.";
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    return "Telefone deve ter DDD e 10 ou 11 numeros.";
  }
  if (phoneDigits.slice(0, 2) === "00") return "DDD do telefone invalido.";
  if (password !== undefined && password.length < 6) {
    return "Senha deve ter pelo menos 6 caracteres.";
  }

  return "";
};

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const getErrorMessage = (error, fallbackMessage) => {
    if (!error.response) {
      return "Erro ao conectar com servidor.";
    }

    const backendMessage = error.response?.data?.error;

    const messages = {
      "Invalid email or password": "E-mail ou senha inválidos.",
      "Invalid token": "Token inválido.",
      "Token not provided": "Token não informado.",
      "Access denied": "Acesso negado.",
      "User not found": "Usuário não encontrado.",
      "Internal server error": fallbackMessage,
      "Email already exists": "E-mail já cadastrado.",
      "Name is required": "Nome é obrigatório.",
      "Email is required": "E-mail é obrigatório.",
      "Invalid email format": "Formato de e-mail inválido.",
      "Phone is required": "Telefone é obrigatório.",
      "Phone must contain only numbers": "Telefone deve conter apenas números.",
      "Phone must have 10 or 11 digits":
        "Telefone deve ter DDD e 10 ou 11 números.",
      "Invalid phone area code": "DDD do telefone inválido.",
      "Phone must have at least 8 digits":
        "Telefone deve ter pelo menos 8 dígitos.",
      "Name must have at least 3 characters":
        "Nome deve ter pelo menos 3 caracteres.",
      "Password is required": "Senha é obrigatória.",
      "Password must have at least 6 characters":
        "Senha deve ter pelo menos 6 caracteres.",
    };

    return messages[backendMessage] || backendMessage || fallbackMessage;
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Informe e-mail e senha.");
      return;
    }

    if (!isValidEmail(email.trim())) {
      toast.error("Formato de e-mail invalido.");
      return;
    }

    setIsLoggingIn(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", response.data.token);

      toast.success("Login realizado com sucesso!");

      await fetchUsers();
    } catch (error) {
      console.error(error);

      toast.error(getErrorMessage(error, "E-mail ou senha inválidos."));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    const validationError = validateUserForm({
      name,
      email: newUserEmail,
      phone,
      password: newUserPassword,
    });

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsCreatingUser(true);

    try {
      await axios.post(`${API_URL}/users`, {
        name: name.trim(),
        email: newUserEmail.trim(),
        phone: stripPhoneDigits(phone),
        password: newUserPassword,
      });

      toast.success("Usuário criado com sucesso!");

      setName("");
      setNewUserEmail("");
      setPhone("");
      setNewUserPassword("");

      await fetchUsers();
    } catch (error) {
      console.error(error);

      toast.error(getErrorMessage(error, "Erro ao criar usuário."));
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm("Deseja realmente excluir sua conta?");

    if (!confirmed) return;

    setDeletingUserId(id);

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Usuário excluído com sucesso!");

      await fetchUsers();
    } catch (error) {
      console.error(error);

      toast.error(getErrorMessage(error, "Erro ao excluir usuário."));
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleStartEdit = (user) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(formatPhone(user.phone));
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    const validationError = validateUserForm({
      name: editName,
      email: editEmail,
      phone: editPhone,
    });

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUpdatingUser(true);

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/users/${editingUserId}`,
        {
          name: editName.trim(),
          email: editEmail.trim(),
          phone: stripPhoneDigits(editPhone),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Usuário atualizado com sucesso!");

      setEditingUserId(null);
      setEditName("");
      setEditEmail("");
      setEditPhone("");

      await fetchUsers();
    } catch (error) {
      console.error(error);

      toast.error(getErrorMessage(error, "Erro ao atualizar usuário."));
    } finally {
      setIsUpdatingUser(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void fetchUsers();
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsers([]);
    toast.success("Logout realizado com sucesso!");
  };

  return (
    <div className="box-border min-h-screen overflow-y-auto bg-[#edf2f7] px-3 py-2 text-slate-950 sm:px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid #334155",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#f8fafc",
            },
          },
          error: {
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#f8fafc",
            },
          },
        }}
      />

      <div className="mx-auto grid min-h-[calc(100vh-1rem)] max-w-7xl gap-2 lg:grid-rows-[auto_1fr]">
        <header className="flex min-h-0 flex-col gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              React + Node.js + PostgreSQL
            </span>

            <h1 className="text-lg font-bold leading-tight sm:truncate md:text-xl">
              Painel de Gerenciamento de Usuários
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="w-full shrink-0 rounded-md border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
          >
            Sair
          </button>
        </header>

        <main className="grid min-h-0 grid-cols-1 gap-2 lg:grid-cols-[340px_1fr]">
          <section className="grid min-h-0 gap-2 lg:grid-rows-[auto_auto_1fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-2 flex flex-col gap-1.5 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
                <div>
                  <h2 className="text-base font-bold">Acessar conta</h2>
                  <p className="text-[11px] text-slate-500">
                    Entre para carregar seus dados.
                  </p>
                </div>

                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  JWT
                </span>
              </div>

              <form onSubmit={handleLogin} className="grid gap-2">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
                />

                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="rounded-md bg-emerald-600 py-1.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoggingIn ? "Entrando..." : "Entrar"}
                </button>
              </form>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-2 flex flex-col gap-1.5 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
                <div>
                  <h2 className="text-base font-bold">Criar usuário</h2>
                  <p className="text-[11px] text-slate-500">
                    Cadastre uma nova conta.
                  </p>
                </div>

                <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  Novo
                </span>
              </div>

              <div className="mb-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-medium leading-snug text-amber-800">
                <p>Ambiente de demonstração.</p>
                <p>Utilize e-mail, telefone e senha fictícios.</p>
              </div>

              <form onSubmit={handleCreateUser} className="grid gap-2">
                <input
                  type="text"
                  placeholder="Nome"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={3}
                  className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
                />

                <input
                  type="email"
                  placeholder="E-mail"
                  value={newUserEmail}
                  onChange={(event) => setNewUserEmail(event.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
                />

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Telefone"
                    value={phone}
                    onChange={(event) => setPhone(formatPhone(event.target.value))}
                    inputMode="numeric"
                    maxLength={15}
                    required
                    className="min-w-0 rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
                  />

                  <input
                    type="password"
                    placeholder="Senha"
                    value={newUserPassword}
                    onChange={(event) => setNewUserPassword(event.target.value)}
                    required
                    minLength={6}
                    className="min-w-0 rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="rounded-md bg-slate-950 py-1.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreatingUser ? "Criando..." : "Criar usuário"}
                </button>
              </form>
            </div>

            <div className="hidden min-h-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm lg:block [@media(max-height:760px)]:hidden">
              <p className="mb-2 text-sm font-bold text-slate-800">
                Segurança aplicada
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                <span className="rounded-md bg-slate-100 px-3 py-1.5">
                  bcrypt
                </span>
                <span className="rounded-md bg-slate-100 px-3 py-1.5">JWT</span>
                <span className="rounded-md bg-slate-100 px-3 py-1.5">
                  Rotas privadas
                </span>
                <span className="rounded-md bg-slate-100 px-3 py-1.5">
                  Acesso próprio
                </span>
              </div>
            </div>
          </section>

          <section className="grid min-h-0 gap-3 lg:grid-rows-[1fr_auto]">
            <div className="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <div className="mb-3 flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <h2 className="text-base font-bold">Minha conta</h2>
                  <p className="text-xs text-slate-500 sm:truncate">
                    Dados retornados pela API protegida.
                  </p>
                </div>

                <div className="shrink-0 rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
                  {users.length} registro(s)
                </div>
              </div>

              <div className="min-h-0 flex-1 space-y-2 lg:overflow-y-auto lg:pr-1">
                {users.length === 0 && (
                  <div className="grid min-h-40 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500 lg:h-full">
                    Faça login para carregar seus dados.
                  </div>
                )}

                {users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-slate-950">
                          {user.name}
                        </h3>

                        <p className="truncate text-sm text-slate-600">
                          {user.email}
                        </p>

                        <p className="text-xs text-slate-500">
                          Telefone: {formatPhone(user.phone)}
                        </p>
                      </div>

                      <div className="grid shrink-0 grid-cols-2 gap-2 md:flex">
                        <button
                          onClick={() => handleStartEdit(user)}
                          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deletingUserId === user.id}
                          className="rounded-md bg-rose-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingUserId === user.id
                            ? "Excluindo..."
                            : "Excluir"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {editingUserId && (
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold">Editar conta</h2>
                    <p className="text-xs text-slate-500">
                      Atualize os dados selecionados.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleUpdateUser}
                  className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[1fr_1fr_160px_auto_auto]"
                >
                  <input
                    type="text"
                    placeholder="Nome"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    required
                    minLength={3}
                    className="min-w-0 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
                  />

                  <input
                    type="email"
                    placeholder="E-mail"
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    required
                    className="min-w-0 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
                  />

                  <input
                    type="text"
                    placeholder="Telefone"
                    value={editPhone}
                    onChange={(event) =>
                      setEditPhone(formatPhone(event.target.value))
                    }
                    inputMode="numeric"
                    maxLength={15}
                    required
                    className="min-w-0 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
                  />

                  <button
                    type="submit"
                    disabled={isUpdatingUser}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUpdatingUser ? "Salvando..." : "Salvar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingUserId(null)}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                </form>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
