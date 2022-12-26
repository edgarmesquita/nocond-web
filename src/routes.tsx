import { DocumentPage } from "./document";
import { LoginPage, SigninOidcPage, SignoutOidcPage } from "./identity";
import { MeetingPage, MeetingTypePage, VotingSessionPage } from "./meeting";
import { PersonPage } from "./person";
import { EmailTemplatePage, SettingsPage } from "./settings";
import { DashboardPage, HomePage, NotFoundPage } from "./shared";
import { CouncilPage, OwnerPage, OwnerTypePage, UnitGroupPage, UnitPage, UnitTypePage } from "./unit";

export interface ITreeItem {
    title: string;
    icon?: string;
    path?: string | string[];
    exact?: boolean;
    visible?: boolean;
    protected?: boolean;
    component?: any;
    children?: ITreeItem[];
    params?: { [paramName: string]: string }[]
}
const routes: ITreeItem[] = [
    { title: "Login", path: '/login', exact: true, component: LoginPage },
    { title: 'Saindo', path: '/signout-oidc', exact: true, component: SignoutOidcPage },
    { title: 'Entrando', path: '/signin-oidc', exact: true, component: SigninOidcPage },
    { title: "Portal", icon: "home", visible: true, path: '/', exact: true, component: HomePage, protected: true },
    { title: "Dashboard", icon: "dashboard", visible: true, path: '/dashboard', exact: true, component: DashboardPage, protected: true },
    {
        title: "Documentos", icon: "description", visible: true, path: '/documents/:type', exact: false, component: DocumentPage, protected: true, children: [
            { title: "Editais", visible: true, params: [{ type: "notices" }] },
            { title: "Atas", visible: true, params: [{ type: "minutes" }] }
        ]
    },
    {
        title: "Assembléias", icon: "local_library", visible: true, children: [
            { title: "Lista de Assembléias", visible: true, path: '/meetings', exact: true, component: MeetingPage, protected: true },
            { title: "Tipos de Assembléias", visible: true, path: '/meeting-types', exact: true, component: MeetingTypePage, protected: true },
            { title: 'Sessões de Voto', path: '/meetings/:meetingId/voting-sessions', exact: true, component: VotingSessionPage, protected: true },
        ]
    },
    {
        title: "Condomínios", icon: "apartment", visible: true, children: [
            { title: "Lista de Condomínios", visible: true, path: '/unit-groups', exact: true, component: UnitGroupPage, protected: true },
            { title: "Lista de Unidades", visible: true, path: ['/units', '/unit-groups/:unitGroupId/units'], exact: true, component: UnitPage, protected: true },
            { title: "Tipos de Unidades", visible: true, path: '/unit-types', exact: true, component: UnitTypePage, protected: true },
            { title: 'Lista de Conselhos', visible: true, path: ['councils', '/unit-groups/:unitGroupId/councils'], exact: true, component: CouncilPage, protected: true },
        ]
    },
    {
        title: "Pessoas", icon: "person", visible: true, children: [
            { title: "Lista de Pessoas", visible: true, path: '/people', exact: true, component: PersonPage, protected: true },
            { title: "Lista de Proprietários", visible: true, path: '/owners', exact: true, component: OwnerPage, protected: true },
            { title: "Tipos de Proprietários", visible: true, path: '/owner-types', exact: true, component: OwnerTypePage, protected: true },
        ]
    },
    {
        title: "Configurações", icon: "settings", visible: true, children: [
            { title: "Geral", visible: true, path: '/configurations/general', exact: true, component: SettingsPage, protected: true },
            { title: "Template de E-mails", visible: true, path: '/configurations/email-templates', exact: true, component: EmailTemplatePage, protected: true },
        ]
    },
    { title: 'Página não encontrada', component: NotFoundPage, protected: false }
]

export default routes;