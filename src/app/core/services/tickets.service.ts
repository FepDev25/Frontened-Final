import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../../models/ticket.model';
import { ClienteOcasional } from '../../models/cliente-ocasional.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private apiUrl = 'http://localhost:8080/api/tickets';

  constructor(private http: HttpClient) {}

  // Métodos para tickets
  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  updateTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(this.apiUrl, ticket);
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos para los clientes ocasionales
  getAllClientesOcasionales(): Observable<ClienteOcasional[]> {
    return this.http.get<ClienteOcasional[]>(`${this.apiUrl}/clientes-ocasionales`);
  }

  getClienteOcasionalById(id: number): Observable<ClienteOcasional> {
    return this.http.get<ClienteOcasional>(`${this.apiUrl}/clientes-ocasionales/${id}`);
  }

  createClienteOcasional(cliente: ClienteOcasional): Observable<ClienteOcasional> {
    return this.http.post<ClienteOcasional>(`${this.apiUrl}/clientes-ocasionales`, cliente);
  }

  updateClienteOcasional(cliente: ClienteOcasional): Observable<ClienteOcasional> {
    return this.http.put<ClienteOcasional>(`${this.apiUrl}/clientes-ocasionales`, cliente);
  }

  deleteClienteOcasional(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clientes-ocasionales/${id}`);
  }
}
