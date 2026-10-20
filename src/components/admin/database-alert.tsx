import { CircleAlert } from 'lucide-react';
export function DatabaseAlert() {
  return <div className="admin-alert" role="status"><CircleAlert size={19}/><div><strong>O banco de dados ainda não está disponível.</strong>Confira <code>DATABASE_URL</code> no arquivo <code>.env</code>, inicie o MySQL e execute <code>npm run db:migrate</code>. As configurações e os contatos serão exibidos após a conexão.</div></div>;
}
