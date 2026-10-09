import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink, provideRouter } from '@angular/router';
import { afterEach } from 'vitest';
import { Brand } from './brand';

describe('Brand', () => {
    let fixture: ComponentFixture<Brand>;
    let base: HTMLBaseElement;
    let previousBaseHref: string | null;

    beforeEach(async () => {
        base = document.querySelector('base') ?? document.createElement('base');
        previousBaseHref = base.parentNode ? base.getAttribute('href') : null;
        base.href = '/hitkeep/';
        if (!base.parentNode) {
            document.head.append(base);
        }

        await TestBed.configureTestingModule({
            imports: [Brand],
            providers: [provideRouter([]), { provide: APP_BASE_HREF, useValue: '/hitkeep/' }]
        }).compileComponents();

        fixture = TestBed.createComponent(Brand);
        fixture.detectChanges();
    });

    afterEach(() => {
        if (previousBaseHref === null) {
            base.remove();
        } else {
            base.setAttribute('href', previousBaseHref);
        }
    });

    it('loads the wordmark SVG from the configured browser base path', () => {
        const component = fixture.componentInstance as unknown as { logoUrl: () => string };

        expect(component.logoUrl()).toBe('/hitkeep/brand-logo.svg');
    });

    it('scales the wordmark for the large size', () => {
        const largeFixture = TestBed.createComponent(Brand);

        largeFixture.componentRef.setInput('size', 'large');
        largeFixture.detectChanges();

        const image = largeFixture.nativeElement.querySelector('img');

        expect(image?.classList.contains('h-12')).toBe(true);
        expect(image?.getAttribute('width')).not.toBe(fixture.nativeElement.querySelector('img')?.getAttribute('width'));
    });

    it('describes the wordmark for screen readers', () => {
        const image = fixture.nativeElement.querySelector('img');

        expect(image?.getAttribute('alt')).toContain('Analytics');
    });

    it('routes the brand to the configured app root without a document navigation', () => {
        const link = fixture.nativeElement.querySelector('a');

        expect(fixture.debugElement.query(By.directive(RouterLink))).not.toBeNull();
        expect(link?.getAttribute('href')).toBe('/hitkeep/');
    });
});
