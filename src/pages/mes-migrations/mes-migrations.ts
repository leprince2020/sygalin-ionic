import {GlobalProvider} from '../../providers/global/global';
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {animate, state, style, transition, trigger} from "@angular/animations";

/**
 * Generated class for the MesMigrationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-mes-migrations',
	templateUrl: 'mes-migrations.html',
	animations: [
		trigger('listItemState', [
			state('in',
				style({
					opacity: 1,
					height: '*',
					minHeight: '*'
				})
			),
			transition('* => void', [
				animate('0.57s ease-out', style({
					opacity: 0,
					height: '1px',
					minHeight: '1px'
				}))
			])
		])
	]
})
export class MesMigrationsPage {
	migra: Array<any>;
	page: string;
	title: string;
	checkedID: Array<any>;


	constructor(public _ALERT: AlertController, public navCtrl: NavController, public navParams: NavParams, public _SYGALIN: GlobalProvider) {
		this.page = this.navParams.get('page');
	}


	ionViewDidLoad() {
		this._SYGALIN.loadingPresent("Chargement de la liste");
		this.checkedID=[];
		if (this.page === "forPDV") {
			//this.title = "Mes recrutements";
			console.log('ENTERED MES MIGRATIONS');
			this.mesMigrations();
		} else if (this.page === "toTreat") {
			//this.title = "Migrations à traiter";
			console.log('ENTERED MES MIGRATIONS');
			this.migrationToTreat();
		} else if (this.page === "rejected") {
			this.title = "Réabonnements rejetés";
			this.migrationRejected();
		} else if (this.page === "treated") {
			this.title = "Réabonnements traités";
			this.migrationTreated();
		}
	}

	mesMigrations(event?: any) {
		//console.log('mesMigrations()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('shop', cuser.shop);
		let that = this;
		this._SYGALIN.query('myMigrationRequests/', postData).then(res => {
			//console.log(res);
			that.migra = res;
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			//console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		});
	}

	migrationToTreat(event?: any) {
		//console.log('mesreabototreat()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('sector', cuser.sector);
		postData.append('role', cuser.role);
		postData.append('uId', cuser.id);
		let that = this;
		this._SYGALIN.query('migrationToTreat/', postData).then(res => {
			//console.log(res);
			that.migra = res;
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			//console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	validateMigr(request: any) {
		// Ref AlertController
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user', cuser.id);
		postData.append('kit', request.materiel);
		postData.append('migr', request.id);
		postData.append('ticket', request.tkId);
		postData.append('montant', request.montant);
		postData.append('idBtq', request.boutique);
		let that = this;
		this._SYGALIN.loadingPresent("Validation du recrutement");
		this._SYGALIN.query('validateMigr/', postData).then(res => {
			//console.log(res);
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(request);
				if (!that.migra.length) {
					that.migrationToTreat();
				}
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res['message'], type, 4000);
			//that.recruts=res;
		}).catch(error => {
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
			//console.log(error);
		});
	}

	rejectMigr(request: any, motivation: string) {
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user', cuser.id);
		postData.append('motif', motivation);
		postData.append('migr', request.id);
		postData.append('ticket', request.tkId);
		let that = this;
		this._SYGALIN.loadingPresent("Rejet de la migration");
		this._SYGALIN.query('rejectMigr/', postData).then(res => {
			//console.log(res);
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(request);
				if (!that.migra.length) {
					that.migrationToTreat();
				}
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res['message'], type, 4000);
			//that.recruts=res;
		}).catch(error => {
			//console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
		});
	}

	migrationRejected(event?: any) {
		//console.log('mesRecru()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('sector', cuser.sector);
		postData.append('role', cuser.role);
		postData.append('uId', cuser.id);
		let that = this;
		this._SYGALIN.query('migrationRejected/', postData).then(res => {
			//console.log(res);
			that.migra = res;
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			//console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Une erreur interne s'est produite", "warning", 6000);
		});
	}

	migrationTreated(event?: any) {
		//console.log('mesRecru()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('sector', cuser.sector);
		postData.append('role', cuser.role);
		postData.append('uId', cuser.id);
		let that = this;
		this._SYGALIN.query('migrationTreated/', postData).then(res => {
			//console.log(res);
			that.migra = res;
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			//console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Une erreur interne s'est produite", "warning", 6000);
		});
	}

	presentConfirm(request: any, type: string) {
		let msg = "", title = "";
		if (type === 'validate') {
			title = "validation";
			msg = 'valider';
		} else {
			title = "rejet";
			msg = 'rejeter';
		}

		let alert = this._ALERT.create({
			title: 'Confirmation de ' + title,
			message: 'Voulez-vous vraiment ' + msg + ' cette migration ? Cette opération est irréversible...',
			buttons: [
				{
					text: 'Non',
					role: 'cancel',
					handler: () => {
						console.log('Opération annulée');
					}
				},
				{
					text: 'Oui',
					handler: () => {
						if (type === 'validate') {
							this.validateMigr(request);
						} else {
							this.presentPrompt(request);
						}
					}
				}
			]
		});
		alert.present();
	}

	presentPrompt(request: any) {
		let alert = this._ALERT.create({
			title: 'Motif de rejet (Obligatoire)',
			inputs: [
				{
					name: 'motivation',
					placeholder: 'Redigez votre motif ici...'
				}
			],
			buttons: [
				{
					text: 'Annuler',
					role: 'cancel',
					handler: data => {
						console.log('Opération annulée');
					}
				},
				{
					text: 'OK',
					handler: data => {
						if (data.motivation !== null && data.motivation !== undefined && data.motivation !== "") {
							this.rejectMigr(request, data.motivation);
						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}

	removeItem(item) {
		let pos = this.migra.map(function (e) {
			return e.ticket;
		}).indexOf(item.ticket);
		this.migra.splice(pos, 1);
	}

	doRefresh(event) {
		if (this.page === "forPDV") {
			this.mesMigrations(event);
		} else if (this.page === "toTreat") {
			this.migrationToTreat(event);
		} else if (this.page === "treated") {
			this.migrationTreated(event);
		} else if (this.page === "rejected") {
			this.migrationRejected(event);
		}
	}

	verifyID(request: any) {
		let options={
			title: 'Vérification de l\'ID de la transaction',
			inputs: [
				{
					name: 'id_trans',
					placeholder: 'ID Transaction reçu...'
				}
			],
			buttons: [
				{
					text: 'Annuler',
					role: 'cancel',
					handler: data => {
						console.log('Opération annulée');
					}
				},
				{
					text: 'Comparer',
					handler: data => {
						if (data.id_trans == request.id_trans) {
							this.checkedID.push(request.numTicket);
							this._SYGALIN.presentToast('Les identifiants correspondent', 'success', 1500);
						} else {
							this._SYGALIN.presentToast('Les identifiants ne correspondent pas', 'danger', 1500);
						}
					}
				}
			]
		};

		let alert = this._ALERT.create(options);
		alert.present();
	}
}
